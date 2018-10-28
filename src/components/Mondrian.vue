<template>
    <div class="svg-container">
        <svg :width="width" :height="height">
            <g mask="url(#texture)">
                <rect v-for="(rectangle, index) of rectangles" :key="index"
                      :x="rectangle.x" :y="rectangle.y"
                      :width="rectangle.width" :height="rectangle.height"
                      :class="rectangle.colorClass"></rect>
                <line v-for="horizontal in horizontals" :key="horizontal.id"
                      :x1="horizontal.start.x" :y1="horizontal.start.y"
                      :x2="horizontal.end.x" :y2="horizontal.end.y"
                      :stroke-width="horizontal.width"
                      style="filter: url(#displacementFilter)"></line>
                <line v-for="vertical in verticals" :key="vertical.id"
                      :x1="vertical.start.x" :y1="vertical.start.y"
                      :x2="vertical.end.x" :y2="vertical.end.y"
                      :stroke-width="vertical.width"
                      style="filter: url(#displacementFilter)"></line>
            </g>
            <defs>
                <pattern x="0" y="0" width="256" height="256" id="texture-pattern" patternUnits="userSpaceOnUse">
                    <image xlink:href="img/textile.png" width="256" height="256"></image>
                </pattern>
                <mask id="texture">
                    <rect :height="height" :width="width" fill="url(#texture-pattern)"></rect>
                </mask>
                <filter x="0" y="0" :height="height" :width="width" id="displacementFilter" filterUnits="userSpaceOnUse">
                    <feTurbulence type="turbulence" baseFrequency="1.5"
                                  numOctaves="2" result="turbulence"></feTurbulence>
                    <feDisplacementMap in2="turbulence" in="SourceGraphic"
                                       scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
                </filter>
            </defs>
        </svg>
    </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      width: 100,
      height: 100,
      aspectRatio: 1,
      horizontals: [],
      verticals: [],
      rectangles: []
    };
  },
  mounted() {
    this.aspectRatio = 1 + (0.5 - Math.random()) * 0.1;
    this.getSvgWidth();
    this.getHorizontals();
    this.getVerticals();
    this.adjustEndpoints();
    this.getRectangles();
  },
  methods: {
    getSvgWidth() {
      this.width = Math.min(this.$el.offsetHeight, this.$el.offsetWidth);
      this.height = this.width; //todo: make rectangles?
    },
    getLines(nLines, size) {
      //base line generator
      const lambda = Math.floor(Math.random() * 5) + 1;
      let lines = [Math.max(1, this.poisson(lambda))];
      for (let i = 1; i < nLines + 1; i++) {
        lines[i] = lines[i - 1] + this.poisson(lambda);
      }
      const scale = size / lines[nLines];
      lines = lines.map(h => Math.floor(h * scale));
      do {
        lines.pop();
      } while (lines[lines.length - 1] >= size);
      return lines;
    },
    getHorizontals() {
      // establish base horizontal lines
      const lines = this.getLines(10, this.height);
      let widthBase = Math.floor(this.height / 64);
      widthBase += this.poisson(widthBase / 4);
      this.horizontals = lines.map((l, idx) => {
        return {
          id: `horizontal-${idx}`,
          width: widthBase + this.poisson(widthBase / 8),
          start: {
            x: 0,
            y: l
          },
          end: {
            x: this.width,
            y: l
          }
        };
      });
    },
    getVerticals() {
      // establish base vertical lines
      const lines = this.getLines(10, this.width);
      let widthBase = Math.floor(this.width / 64);
      widthBase += this.poisson(widthBase / 4);
      this.verticals = lines.map((l, idx) => {
        return {
          id: `vertical-${idx}`,
          width: widthBase + this.poisson(widthBase / 8),
          start: {
            x: l,
            y: 0
          },
          end: {
            x: l,
            y: this.height
          }
        };
      });
    },
    adjustEndpoints() {
      // scoot the ends of the lines in a bit
      this.horizontals.forEach(h => {
        const startIdx = Math.min(this.poisson(1), this.verticals.length - 2);
        const endIdx = Math.max(
          startIdx + 1,
          this.verticals.length - 1 - this.poisson(1)
        );
        if (
          startIdx > 0 &&
          this.verticals[startIdx].start.y < h.start.y &&
          this.verticals[startIdx].end.y > h.start.y
        ) {
          h.start.x = this.verticals[startIdx].start.x;
        }
        if (
          endIdx < this.verticals.length - 1 &&
          this.verticals[endIdx].start.y < h.start.y &&
          this.verticals[endIdx].end.y > h.start.y
        ) {
          h.end.x = this.verticals[endIdx].start.x;
        }
      });
      this.verticals.forEach(h => {
        const startIdx = Math.min(this.poisson(1), this.horizontals.length - 2);
        const endIdx = Math.max(
          startIdx + 1,
          this.horizontals.length - 1 - this.poisson(1)
        );
        let truncateOk = true;
        for (let i = 0; i <= startIdx; i++) {
          truncateOk =
            truncateOk &&
            (this.horizontals[i].start.x < h.start.x &&
              this.horizontals[i].end.x > h.start.x);
        }
        if (startIdx > 0 && truncateOk) {
          h.start.y = this.horizontals[startIdx].start.y;
        }
        truncateOk = true;
        for (let i = this.horizontals.length - 1; i >= endIdx; i--) {
          truncateOk =
            truncateOk &&
            (this.horizontals[i].start.x < h.start.x &&
              this.horizontals[i].end.x > h.start.x);
        }
        if (endIdx < this.horizontals.length - 1 && truncateOk) {
          h.end.y = this.horizontals[endIdx].start.y;
        }
      });
    },
    getRectangles() {
      // figure out the rectangles via brutal force
      const rectangles = new Map();
      const xs = [...this.verticals.map(v => v.start.x - 1), this.width - 1];
      const ys = [...this.horizontals.map(h => h.start.y - 1), this.height - 1];
      xs.forEach(x => {
        ys.forEach(y => {
          const rect = this.getBoundingRectangle(x, y);
          rectangles.set(`${rect.x}-${rect.y}`, rect);
        });
      });
      const rectArray = Array.from(rectangles.values());
      rectArray.forEach(r => {
        r.colorClass = this.getColor();
      });
      this.rectangles = rectArray;
    },
    getColor() {
      // give rectangles some color
      const whiteClasses = ["white-base", "white-light", "white-dark"];
      const colorClasses = [
        "red-base",
        "red-dark",
        "red-light",
        "yellow-base",
        "yellow-dark",
        "yellow-light",
        "blue-base",
        "blue-dark",
        "blue-light",
        "black-base"
      ];
      const isColorful = Math.random() < 0.2;
      let array = whiteClasses;
      if (isColorful) {
        array = colorClasses;
      }
      return array[Math.floor(Math.random() * array.length)];
    },
    getBoundingRectangle(x, y) {
      let x0 = 0;
      let x1 = undefined;
      let y0 = 0;
      let y1 = undefined;
      this.verticals.forEach(v => {
        if (v.start.x < x && v.start.y < y && v.end.y > y) {
          // the last vertical that bounds this point to the left
          x0 = v.start.x;
        }
        if (!x1 && v.start.x > x && v.start.y < y && v.end.y > y) {
          // the first vertical that bounds this point to the right
          x1 = v.start.x;
        }
      });
      this.horizontals.forEach(h => {
        if (h.start.y < y && h.start.x < x && h.end.x > x) {
          // the last horizontal that bounds this point to the top
          y0 = h.start.y;
        }
        if (!y1 && h.start.y > y && h.start.x < x && h.end.x > x) {
          // the first horizontal that bounds this point to the bottom
          y1 = h.start.y;
        }
      });
      if (!x1) x1 = this.width;
      if (!y1) y1 = this.height;
      return {
        x: x0,
        y: y0,
        width: x1 - x0,
        height: y1 - y0
      };
    },
    poisson(lambda) {
      // sample from poisson distribution, ala knuth
      var L = Math.exp(-lambda);
      var k = 0;
      var p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return k - 1;
    }
  }
};
</script>

<style scoped lang="scss">
$base-white: #f5f3f4;
$base-red: #ff3724;
$base-yellow: #ffe635;
$base-blue: #1444b2;
$base-black: #17171a;
.svg-container {
  height: 100%;
  width: 100%;
}
line {
  stroke: darken($base-black, 15%);
}
.white-base {
  fill: $base-white;
}
.white-light {
  fill: lighten($base-white, 3%);
}
.white-dark {
  fill: darken($base-white, 2%);
}
.red-base {
  fill: $base-red;
}
.red-light {
  fill: lighten($base-red, 3%);
}
.red-dark {
  fill: darken($base-red, 3%);
}
.yellow-base {
  fill: $base-yellow;
}
.yellow-light {
  fill: lighten($base-yellow, 3%);
}
.yellow-dark {
  fill: darken($base-yellow, 3%);
}
.blue-base {
  fill: $base-blue;
}
.blue-light {
  fill: darken($base-blue, 3%);
}
.blue-dark {
  fill: lighten($base-blue, 3%);
}
.black-base {
  fill: $base-black;
}
</style>
