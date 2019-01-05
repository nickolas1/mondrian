<template>
    <div class="svg-container" v-resize="drawEverything" v-if="initialized">
        <svg :width="width" :height="height" id="mondrian-image">
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
import { mulberry32, poisson } from "../random-util";

export default {
  name: "Mondrian",
  props: {
    rngSeed: Number,
    linesBase: Number,
    colorPercentage: Number,
    redPercentage: Number,
    bluePercentage: Number,
    yellowPercentage: Number,
    mutedPercentage: Number
  },
  data() {
    return {
      width: 100,
      height: 100,
      horizontals: [],
      verticals: [],
      rectangles: [],
      rand: undefined,
      initialized: false
    };
  },
  watch: {
    rngSeed: function() {
      this.drawEverything();
    },
    linesBase: function() {
      this.drawEverything();
    },
    colorPercentage: function() {
      this.drawEverything();
    },
    redPercentage: function() {
      this.drawEverything();
    },
    bluePercentage: function() {
      this.drawEverything();
    },
    yellowPercentage: function() {
      this.drawEverything();
    }
  },
  methods: {
    drawEverything() {
      this.rand = mulberry32(this.rngSeed);
      this.getSvgWidth();
      this.getHorizontals();
      this.getVerticals();
      this.adjustEndpoints();
      this.getRectangles();
      this.scaleLinesAndRectangles();
      this.initialized = true;
    },
    getSvgWidth() {
      this.width = Math.min(
        this.$parent.$el.offsetHeight,
        this.$parent.$el.offsetWidth
      );
      this.height = this.width; //todo: make rectangles?
    },
    getLines(nLines) {
      //base line generator, generates lines between 0 and 1
      const lambda = Math.floor(this.rand() * 5) + 1;
      let lines = [];
      lines = [Math.max(1, poisson(lambda, this.rand))];
      for (let i = 1; i < nLines + 1; i++) {
        lines[i] = lines[i - 1] + poisson(lambda, this.rand);
      }
      const scale = 1 / lines[nLines];
      lines = lines.map(h => h * scale);
      do {
        lines.length === 1 ? (lines[0] *= this.rand()) : lines.pop();
      } while (lines[lines.length - 1] >= 1);
      return lines;
    },
    getHorizontals() {
      // establish base horizontal lines
      const lines = this.getLines(this.linesBase);
      // set widths assuming size of 512 and scale later
      const widthBase = 8 + poisson(2, this.rand);
      this.horizontals = lines.map((l, idx) => {
        return {
          id: `horizontal-${idx}`,
          width: widthBase + poisson(1, this.rand),
          start: {
            x: 0,
            y: l
          },
          end: {
            x: 1,
            y: l
          }
        };
      });
    },
    getVerticals() {
      // establish base vertical lines
      const lines = this.getLines(this.linesBase);
      // set widths assuming size of 512 and scale later
      const widthBase = 8 + poisson(2, this.rand);
      this.verticals = lines.map((l, idx) => {
        return {
          id: `vertical-${idx}`,
          width: widthBase + poisson(1, this.rand),
          start: {
            x: l,
            y: 0
          },
          end: {
            x: l,
            y: 1
          }
        };
      });
    },
    adjustEndpoints() {
      // scoot the ends of the lines in a bit
      this.horizontals.forEach(h => {
        const startIdx = Math.min(
          poisson(1, this.rand),
          this.verticals.length - 2
        );
        const endIdx = Math.max(
          startIdx + 1,
          this.verticals.length - 1 - poisson(1, this.rand)
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
        const startIdx = Math.min(
          poisson(1, this.rand),
          this.horizontals.length - 2
        );
        const endIdx = Math.max(
          startIdx + 1,
          this.horizontals.length - 1 - poisson(1, this.rand)
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
      const epsilon = Number.EPSILON;
      const rectangles = new Map();
      const xs = [...this.verticals.map(v => v.start.x - epsilon), 1 - epsilon];
      const ys = [
        ...this.horizontals.map(h => h.start.y - epsilon),
        1 - epsilon
      ];
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
    scaleLinesAndRectangles() {
      // coordinates range from 0 to 1 right now and widths assume 512px- scale to svg size
      this.verticals.forEach(v => (v.width *= this.width / 512));
      this.horizontals.forEach(v => (v.width *= this.height / 512));
      [...this.verticals, ...this.horizontals].forEach(l => {
        l.start.x *= this.width;
        l.end.x *= this.width;
        l.start.y *= this.height;
        l.end.y *= this.height;
      });
      this.rectangles.forEach(r => {
        r.x *= this.width;
        r.y *= this.height;
        r.width *= this.width;
        r.height *= this.height;
      });
    },
    getColor() {
      // give rectangles some color
      let array = ["white-base", "white-light", "white-dark"];
      if (this.rand() < this.colorPercentage / 100) {
        let c = this.rand();
        if (c < this.redPercentage / 100) {
          array = ["red-base", "red-dark", "red-light"];
        } else if (c < (this.redPercentage + this.bluePercentage) / 100) {
          array = ["blue-base", "blue-dark", "blue-light"];
        } else if (
          c <
          (this.redPercentage + this.bluePercentage + this.yellowPercentage) /
            100
        ) {
          array = ["yellow-base", "yellow-dark", "yellow-light"];
        } else {
          array = ["black-base"];
        }
      }
      return array[Math.floor(this.rand() * array.length)];
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
