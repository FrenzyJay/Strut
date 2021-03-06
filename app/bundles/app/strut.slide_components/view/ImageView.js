define(["./ComponentView", './Mixers'], function(ComponentView, Mixers) {
    return ComponentView.extend({
      className: "component imageView",
      tagName: "div",
      initialize: function() {
        ComponentView.prototype.initialize.apply(this, arguments);
        if (this.model.get("imageType") === "SVG") {
          return this.scale = Mixers.scaleByResize;
        }
      },
      _finishRender: function($img) {
        var height, naturalHeight, naturalWidth, scale, width;
        naturalWidth = $img[0].naturalWidth;
        naturalHeight = $img[0].naturalHeight;
        if (this.model.get("imageType") === "SVG") {
          $img.css({
            width: "100%",
            height: "100%"
          });
          scale = this.model.get("scale");
          if (scale && scale.width) {
            this.$el.css({
              width: scale.width,
              height: scale.height
            });
          } else {
            width = Math.max(naturalWidth, 50);
            height = Math.max(naturalHeight, 50);
            this.$el.css({
              width: width,
              height: height
            });
            this.model.set("scale", {
              width: width,
              height: height
            });
          }
        } else {
          this.origSize = {
            width: naturalWidth,
            height: naturalHeight
          };
          $img[0].width = naturalWidth;
          $img[0].height = naturalHeight;
          this._setUpdatedTransform();
        }
        $img.bind("dragstart", function(e) {
          e.preventDefault();
          return false;
        });
        this.$content.append($img);
        if (this.model.get("imageType") === "SVG") {
          $img.parent().addClass("svg");
          return $img.parent().parent().addClass("svg");
        }
      },
      render: function() {
        var $img,
          _this = this;
        ComponentView.prototype.render.call(this);
        $img = $("<img src=" + (this.model.get('src')) + "></img>");
        $img.load(function() {
          return _this._finishRender($img);
        });
        $img.error(function() {
          return _this.remove();
        });
        return this.$el;
      }
    });
  });