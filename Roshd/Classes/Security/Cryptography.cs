using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.Collections;
using Roshd.Models;
 

namespace fsf.Security
{
    public static class Cryptography
    {
        //private const string publicKey = "<BitStrength>1024</BitStrength><RSAKeyValue><Modulus>MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbx3VFJWSOX8QaU2BVPRmzuXR+U/lwVXWN0ZTGWNUyviLmSpT5vl259AIJ0x3OZl2VRHl54byUxhPjYXnOY6P7uFUXNq/R7YfN7XWWmyBVsE0lkvWHCCYqf+GgoyUBL8oc/M7hp72PaDYt5q2JOdtULGK3XCysNP3qPkaBMnBKuwIDAQAB</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
        private const string publicKey = "<BitStrength>1024</BitStrength><RSAKeyValue><Modulus>1aZTasqZem3DU1EbEcjkq4NUQokiUwJj8Z7RaNIfTjRS5P0+IlmKH74AWSN28Ggx3kk3oJV/tzeof/h82bVarYE6W3jwIzsGYCE/DRc4evbXM72AJOo9K27KuBKHpK0PKgayBnAcUm5E6KteEv9SIbIhm+AKMeTDKrE/9364Lis=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";

        public static string PublicKey => publicKey;

        public static string Encrypt(string plainText)
        {
            string encryptedText = null;
            if (plainText.Length != 0)
            {
                string publicKey = PublicKey;
                if (publicKey != null)
                {
                    string bitStrengthString = publicKey.Substring(0, publicKey.IndexOf("</BitStrength>") + 14);
                    publicKey = publicKey.Replace(bitStrengthString, "");
                    int bitStrength = Convert.ToInt32(bitStrengthString.Replace("<BitStrength>", "").Replace("</BitStrength>", ""));
                    if (publicKey != null)
                    {
                        try
                        {
                            //encryptedText = Encrypt(new Object[] { plainText, bitStrength, publicKey });
                            encryptedText = EncryptString(plainText, bitStrength, publicKey);

                            return encryptedText;
                        }
                        catch (CryptographicException CEx)
                        {
                            //MessageBox.Show("ERROR: \nOne of the following has occured.\nThe cryptographic service provider cannot be acquired.\nThe length of the text being encrypted is greater than the maximum allowed length.\nThe OAEP padding is not supported on this computer.\n" + "Exact error: " + CEx.Message); 
                        }
                        catch (Exception Ex)
                        {
                            //MessageBox.Show("ERROR: \n" + Ex.Message); 
                        }
                    }
                }
                else encryptedText = null;
            }
            else
            {
                encryptedText = null;
                //MessageBox.Show("ERROR: You Can Not Encrypt A NULL Value!!!"); 
            }
            return encryptedText;
        }

        public static string Decrypt(string encryptedText)
        {
            if (encryptedText.Length != 0)
            {
                string privateKey = "";
                using (var context = new RoshdEntities())
                    privateKey = context.Key().First();

                string bitStrengthString = privateKey.Substring(0, privateKey.IndexOf("</BitStrength>") + 14);
                privateKey = privateKey.Replace(bitStrengthString, "");
                int bitStrength = Convert.ToInt32(bitStrengthString.Replace("<BitStrength>", "").Replace("</BitStrength>", ""));
                if (privateKey != null)
                {
                    try
                    {
                        encryptedText = DecryptString(encryptedText, bitStrength, privateKey);
                    }
                    catch (CryptographicException CEx)
                    {
                        //MessageBox.Show("ERROR: \nOne of the following has occured.\nThe cryptographic service provider cannot be acquired.\nThe length of the text being encrypted is greater than the maximum allowed length.\nThe OAEP padding is not supported on this computer.\n" + "Exact error: " + CEx.Message); 
                    }
                    catch (Exception Ex)
                    {
                        //MessageBox.Show("ERROR:\n" + Ex.Message);
                    }
                }
            }
            else
            {
                //ExtMassage.UploadError();//"ERROR: You Can Not Decrypt A NULL Value!!!"); 
            }

            return encryptedText;
        }

        private static string EncryptString(string inputString, int dwKeySize, string xmlString)
        {
            RSACryptoServiceProvider rsaCryptoServiceProvider = new RSACryptoServiceProvider(dwKeySize);
            rsaCryptoServiceProvider.FromXmlString(xmlString);
            int keySize = dwKeySize / 8;
            byte[] bytes = Encoding.UTF32.GetBytes(inputString);
            int maxLength = keySize - 42;
            int dataLength = bytes.Length;
            int iterations = dataLength / maxLength;
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i <= iterations; i++)
            {
                byte[] tempBytes = new byte[(dataLength - maxLength * i > maxLength) ? maxLength : dataLength - maxLength * i];
                Buffer.BlockCopy(bytes, maxLength * i, tempBytes, 0, tempBytes.Length);
                byte[] encryptedBytes = rsaCryptoServiceProvider.Encrypt(tempBytes, true);
                Array.Reverse(encryptedBytes);
                stringBuilder.Append(Convert.ToBase64String(encryptedBytes));
            }
            return stringBuilder.ToString();
        }

        private static string DecryptString(string inputString, int dwKeySize, string xmlString)
        {
            RSACryptoServiceProvider rsaCryptoServiceProvider = new RSACryptoServiceProvider(dwKeySize);
            rsaCryptoServiceProvider.FromXmlString(xmlString);
            int base64BlockSize = ((dwKeySize / 8) % 3 != 0) ? (((dwKeySize / 8) / 3) * 4) + 4 : ((dwKeySize / 8) / 3) * 4;
            int iterations = inputString.Length / base64BlockSize;
            ArrayList arrayList = new ArrayList();
            for (int i = 0; i < iterations; i++)
            {
                byte[] encryptedBytes = Convert.FromBase64String(inputString.Substring(base64BlockSize * i, base64BlockSize));
                Array.Reverse(encryptedBytes);
                arrayList.AddRange(rsaCryptoServiceProvider.Decrypt(encryptedBytes, true));
            }
            return Encoding.UTF32.GetString(arrayList.ToArray(Type.GetType("System.Byte")) as byte[]);
        }

    }
}
