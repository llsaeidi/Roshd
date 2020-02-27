jQuery.fn.extend({
	treetable: function() {
		var $table = $(this);
		$table.addClass("tt-table");

		var $items = $table.find("div.tt");
		var index = {};
		var items = [];

		// add items to index
		$items.each(function (i, el) {
		    
			var $el = $(el);
			var id = $el.data('tt-id');
			var parent = $el.data('tt-parent');
			if(parent === '') {
				parent = undefined;
			}

			var item = {
				id: id,
				parent: parent,
				children: [],
				el: $el,
				right: 0,
				width: 30
			};

			index[id] = item;
			items.push(item);
		});

		// make a graph from parent relations
		items.forEach(function (item) {
			if (item.parent !== undefined) {
				item.parent = index[item.parent];
				item.parent.children.push(item);
			}
		});

		// pad items
		items.forEach(function (item) {

		    item.right = 0;
			 
		});

		// position items
		items.forEach(function (item) {
			//console.log(el.left);
		    item.el.css("right", item.right);
		});

		// wrap contents
		items.forEach(function (item) {
			item.el.html('<div class="content">' + item.el.html() + '</div>');
		});

		// add parent classes
		items.forEach(function (item) {
			if (item.children.length > 0) {
				item.el.addClass("tt-parent");
				item.showChildren = true;
			}
		});

		// draw lines
		items.forEach(function (item) {
             
			if (item.parent === undefined) {
				return;
			}

			var childPos = item.el.position();
			var parent = item.parent;

			var parentPos = parent.el.position();
			var height = childPos.top - parentPos.top;
			var width = item.right - parent.right;
			var right = parent.right - item.right + (parent.width / 2);

			//var $tail = $('<div class="tail"></div>').css({
			//	height: height,
			//	width: width,
			//	right: right
			//});

			//item.el.prepend($tail);
		});

		// handle click event
		$table.on("click", "div.tt div.content", function (e) {
           
			var $el = $(e.currentTarget).closest(".tt");
			var $tr = $el.closest("tr");
			var id = $el.data('tt-id');
			var item = index[id];
			
			var _id = String(item.id).substring(6, String(item.id).length)
		 
			if (item.showChildren === true) {
				// hide all children
				item.showChildren = false;

				function hide(parentId) {
				    var item = index[parentId];                   
					item.children.forEach(function (child) {
						if (child.showChildren !== undefined) {
							child.showChildren = false;
						}
						$("#ParentImg" + _id).css('transform', '')
						$(child.el).closest("tr").addClass("tt-hide");
						hide(child.id);
					});
				}

				hide(id);
			}
			else {
				// show direct children
				item.showChildren = true;
				item.children.forEach(function (child) {
				    $("#ParentImg" + _id).css('transform', 'rotate(-90deg)')
				    $(child.el).closest("tr").removeClass("tt-hide");
				});
			}
		});

		// initially hide all children
		items.forEach(function (item) {

			if (item.parent === undefined && item.children.length > 0) {
				item.el.find(".content").click();
			}
		});
	}
});

