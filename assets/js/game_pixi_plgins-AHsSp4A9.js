import{F as h,f as _,s as k,h as O,O as ze,g as E,i as F,r as N,T as Pe,S as Fe}from"./game_pixi-BtvCmBUP.js";var Me=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,ke=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uOffset;

void main(void)
{
    vec4 color = vec4(0.0);

    // Sample top left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));

    // Sample top right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));

    // Sample bottom right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));

    // Sample bottom left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));

    // Average
    color *= 0.25;

    gl_FragColor = color;
}`,Oe=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uOffset;
uniform vec4 filterClamp;

void main(void)
{
    vec4 color = vec4(0.0);

    // Sample top left pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample top right pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample bottom right pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample bottom left pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

    // Average
    color *= 0.25;

    gl_FragColor = color;
}
`;let M=class extends h{constructor(e=4,r=3,i=!1){super(Me,i?Oe:ke),this._kernels=[],this._blur=4,this._quality=3,this.uniforms.uOffset=new Float32Array(2),this._pixelSize=new _,this.pixelSize=1,this._clamp=i,Array.isArray(e)?this.kernels=e:(this._blur=e,this.quality=r)}apply(e,r,i,s){const o=this._pixelSize.x/r._frame.width,n=this._pixelSize.y/r._frame.height;let a;if(this._quality===1||this._blur===0)a=this._kernels[0]+.5,this.uniforms.uOffset[0]=a*o,this.uniforms.uOffset[1]=a*n,e.applyFilter(this,r,i,s);else{const u=e.getFilterTexture();let f=r,p=u,b;const m=this._quality-1;for(let v=0;v<m;v++)a=this._kernels[v]+.5,this.uniforms.uOffset[0]=a*o,this.uniforms.uOffset[1]=a*n,e.applyFilter(this,f,p,1),b=f,f=p,p=b;a=this._kernels[m]+.5,this.uniforms.uOffset[0]=a*o,this.uniforms.uOffset[1]=a*n,e.applyFilter(this,f,i,s),e.returnFilterTexture(u)}}_updatePadding(){this.padding=Math.ceil(this._kernels.reduce((e,r)=>e+r+.5,0))}_generateKernels(){const e=this._blur,r=this._quality,i=[e];if(e>0){let s=e;const o=e/r;for(let n=1;n<r;n++)s-=o,i.push(s)}this._kernels=i,this._updatePadding()}get kernels(){return this._kernels}set kernels(e){Array.isArray(e)&&e.length>0?(this._kernels=e,this._quality=e.length,this._blur=Math.max(...e)):(this._kernels=[0],this._quality=1)}get clamp(){return this._clamp}set pixelSize(e){typeof e=="number"?(this._pixelSize.x=e,this._pixelSize.y=e):Array.isArray(e)?(this._pixelSize.x=e[0],this._pixelSize.y=e[1]):e instanceof _?(this._pixelSize.x=e.x,this._pixelSize.y=e.y):(this._pixelSize.x=1,this._pixelSize.y=1)}get pixelSize(){return this._pixelSize}get quality(){return this._quality}set quality(e){this._quality=Math.max(1,Math.round(e)),this._generateKernels()}get blur(){return this._blur}set blur(e){this._blur=e,this._generateKernels()}};var ie=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,De=`
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float threshold;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

    // A simple & fast algorithm for getting brightness.
    // It's inaccuracy , but good enought for this feature.
    float _max = max(max(color.r, color.g), color.b);
    float _min = min(min(color.r, color.g), color.b);
    float brightness = (_max + _min) * 0.5;

    if(brightness > threshold) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}
`;let Re=class extends h{constructor(e=.5){super(ie,De),this.threshold=e}get threshold(){return this.uniforms.threshold}set threshold(e){this.uniforms.threshold=e}};var Le=`uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform sampler2D bloomTexture;
uniform float bloomScale;
uniform float brightness;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.rgb *= brightness;
    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);
    bloomColor.rgb *= bloomScale;
    gl_FragColor = color + bloomColor;
}
`;const oe=class extends h{constructor(e){super(ie,Le),this.bloomScale=1,this.brightness=1,this._resolution=k.FILTER_RESOLUTION,typeof e=="number"&&(e={threshold:e});const r=Object.assign(oe.defaults,e);this.bloomScale=r.bloomScale,this.brightness=r.brightness;const{kernels:i,blur:s,quality:o,pixelSize:n,resolution:a}=r;this._extractFilter=new Re(r.threshold),this._extractFilter.resolution=a,this._blurFilter=i?new M(i):new M(s,o),this.pixelSize=n,this.resolution=a}apply(e,r,i,s,o){const n=e.getFilterTexture();this._extractFilter.apply(e,r,n,1,o);const a=e.getFilterTexture();this._blurFilter.apply(e,n,a,1),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=a,e.applyFilter(this,r,i,s),e.returnFilterTexture(a),e.returnFilterTexture(n)}get resolution(){return this._resolution}set resolution(e){this._resolution=e,this._extractFilter&&(this._extractFilter.resolution=e),this._blurFilter&&(this._blurFilter.resolution=e)}get threshold(){return this._extractFilter.threshold}set threshold(e){this._extractFilter.threshold=e}get kernels(){return this._blurFilter.kernels}set kernels(e){this._blurFilter.kernels=e}get blur(){return this._blurFilter.blur}set blur(e){this._blurFilter.blur=e}get quality(){return this._blurFilter.quality}set quality(e){this._blurFilter.quality=e}get pixelSize(){return this._blurFilter.pixelSize}set pixelSize(e){this._blurFilter.pixelSize=e}};let Ee=oe;Ee.defaults={threshold:.5,bloomScale:1,brightness:1,kernels:null,blur:8,quality:4,pixelSize:1,resolution:k.FILTER_RESOLUTION};var Ie=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,je=`uniform float radius;
uniform float strength;
uniform vec2 center;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

void main()
{
    vec2 coord = vTextureCoord * filterArea.xy;
    coord -= center * dimensions.xy;
    float distance = length(coord);
    if (distance < radius) {
        float percent = distance / radius;
        if (strength > 0.0) {
            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
        } else {
            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
        }
    }
    coord += center * dimensions.xy;
    coord /= filterArea.xy;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    gl_FragColor = color;
}
`;const se=class extends h{constructor(e){super(Ie,je),this.uniforms.dimensions=new Float32Array(2),Object.assign(this,se.defaults,e)}apply(e,r,i,s){const{width:o,height:n}=r.filterFrame;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=n,e.applyFilter(this,r,i,s)}get radius(){return this.uniforms.radius}set radius(e){this.uniforms.radius=e}get strength(){return this.uniforms.strength}set strength(e){this.uniforms.strength=e}get center(){return this.uniforms.center}set center(e){this.uniforms.center=e}};let $e=se;$e.defaults={center:[.5,.5],radius:100,strength:1};var Ne=`const float PI = 3.1415926538;
const float PI_2 = PI*2.;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

const int TYPE_LINEAR = 0;
const int TYPE_RADIAL = 1;
const int TYPE_CONIC = 2;
const int MAX_STOPS = 32;

uniform int uNumStops;
uniform float uAlphas[3*MAX_STOPS];
uniform vec3 uColors[MAX_STOPS];
uniform float uOffsets[MAX_STOPS];
uniform int uType;
uniform float uAngle;
uniform float uAlpha;
uniform int uMaxColors;
uniform bool uReplace;

struct ColorStop {
    float offset;
    vec3 color;
    float alpha;
};

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
    sin(angle), cos(angle));
}

float projectLinearPosition(vec2 pos, float angle){
    vec2 center = vec2(0.5);
    vec2 result = pos - center;
    result = rotate2d(angle) * result;
    result = result + center;
    return clamp(result.x, 0., 1.);
}

float projectRadialPosition(vec2 pos) {
    float r = distance(vFilterCoord, vec2(0.5));
    return clamp(2.*r, 0., 1.);
}

float projectAnglePosition(vec2 pos, float angle) {
    vec2 center = pos - vec2(0.5);
    float polarAngle=atan(-center.y, center.x);
    return mod(polarAngle + angle, PI_2) / PI_2;
}

float projectPosition(vec2 pos, int type, float angle) {
    if (type == TYPE_LINEAR) {
        return projectLinearPosition(pos, angle);
    } else if (type == TYPE_RADIAL) {
        return projectRadialPosition(pos);
    } else if (type == TYPE_CONIC) {
        return projectAnglePosition(pos, angle);
    }

    return pos.y;
}

void main(void) {
    // current/original color
    vec4 currentColor = texture2D(uSampler, vTextureCoord);

    // skip calculations if gradient alpha is 0
    if (0.0 == uAlpha) {
        gl_FragColor = currentColor;
        return;
    }

    // project position
    float y = projectPosition(vFilterCoord, uType, radians(uAngle));

    // check gradient bounds
    float offsetMin = uOffsets[0];
    float offsetMax = 0.0;

    for (int i = 0; i < MAX_STOPS; i++) {
        if (i == uNumStops-1){ // last index
            offsetMax = uOffsets[i];
        }
    }

    if (y  < offsetMin || y > offsetMax) {
        gl_FragColor = currentColor;
        return;
    }

    // limit colors
    if (uMaxColors > 0) {
        float stepSize = 1./float(uMaxColors);
        float stepNumber = float(floor(y/stepSize));
        y = stepSize * (stepNumber + 0.5);// offset by 0.5 to use color from middle of segment
    }

    // find color stops
    ColorStop from;
    ColorStop to;

    for (int i = 0; i < MAX_STOPS; i++) {
        if (y >= uOffsets[i]) {
            from = ColorStop(uOffsets[i], uColors[i], uAlphas[i]);
            to = ColorStop(uOffsets[i+1], uColors[i+1], uAlphas[i+1]);
        }

        if (i == uNumStops-1){ // last index
            break;
        }
    }

    // mix colors from stops
    vec4 colorFrom = vec4(from.color * from.alpha, from.alpha);
    vec4 colorTo = vec4(to.color * to.alpha, to.alpha);

    float segmentHeight = to.offset - from.offset;
    float relativePos = y - from.offset;// position from 0 to [segmentHeight]
    float relativePercent = relativePos / segmentHeight;// position in percent between [from.offset] and [to.offset].

    float gradientAlpha = uAlpha * currentColor.a;
    vec4 gradientColor = mix(colorFrom, colorTo, relativePercent) * gradientAlpha;

    if (uReplace == false) {
        // mix resulting color with current color
        gl_FragColor = gradientColor + currentColor*(1.-gradientColor.a);
    } else {
        // replace with gradient color
        gl_FragColor = gradientColor;
    }
}
`,Ve=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
    vFilterCoord = vTextureCoord * inputSize.xy / outputFrame.zw;
}
`,C=C||{};C.stringify=function(){var t={"visit_linear-gradient":function(e){return t.visit_gradient(e)},"visit_repeating-linear-gradient":function(e){return t.visit_gradient(e)},"visit_radial-gradient":function(e){return t.visit_gradient(e)},"visit_repeating-radial-gradient":function(e){return t.visit_gradient(e)},visit_gradient:function(e){var r=t.visit(e.orientation);return r&&(r+=", "),e.type+"("+r+t.visit(e.colorStops)+")"},visit_shape:function(e){var r=e.value,i=t.visit(e.at),s=t.visit(e.style);return s&&(r+=" "+s),i&&(r+=" at "+i),r},"visit_default-radial":function(e){var r="",i=t.visit(e.at);return i&&(r+=i),r},"visit_extent-keyword":function(e){var r=e.value,i=t.visit(e.at);return i&&(r+=" at "+i),r},"visit_position-keyword":function(e){return e.value},visit_position:function(e){return t.visit(e.value.x)+" "+t.visit(e.value.y)},"visit_%":function(e){return e.value+"%"},visit_em:function(e){return e.value+"em"},visit_px:function(e){return e.value+"px"},visit_literal:function(e){return t.visit_color(e.value,e)},visit_hex:function(e){return t.visit_color("#"+e.value,e)},visit_rgb:function(e){return t.visit_color("rgb("+e.value.join(", ")+")",e)},visit_rgba:function(e){return t.visit_color("rgba("+e.value.join(", ")+")",e)},visit_color:function(e,r){var i=e,s=t.visit(r.length);return s&&(i+=" "+s),i},visit_angular:function(e){return e.value+"deg"},visit_directional:function(e){return"to "+e.value},visit_array:function(e){var r="",i=e.length;return e.forEach(function(s,o){r+=t.visit(s),o<i-1&&(r+=", ")}),r},visit:function(e){if(!e)return"";var r="";if(e instanceof Array)return t.visit_array(e,r);if(e.type){var i=t["visit_"+e.type];if(i)return i(e);throw Error("Missing visitor visit_"+e.type)}else throw Error("Invalid node.")}};return function(e){return t.visit(e)}}();var C=C||{};C.parse=function(){var t={linearGradient:/^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i,repeatingLinearGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i,radialGradient:/^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i,repeatingRadialGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i,sideOrCorner:/^to (left (top|bottom)|right (top|bottom)|left|right|top|bottom)/i,extentKeywords:/^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/,positionKeywords:/^(left|center|right|top|bottom)/i,pixelValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,percentageValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/,emValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,angleValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,startCall:/^\(/,endCall:/^\)/,comma:/^,/,hexColor:/^\#([0-9a-fA-F]+)/,literalColor:/^([a-zA-Z]+)/,rgbColor:/^rgb/i,rgbaColor:/^rgba/i,number:/^(([0-9]*\.[0-9]+)|([0-9]+\.?))/},e="";function r(l){var c=new Error(e+": "+l);throw c.source=e,c}function i(){var l=s();return e.length>0&&r("Invalid input not EOF"),l}function s(){return w(o)}function o(){return n("linear-gradient",t.linearGradient,u)||n("repeating-linear-gradient",t.repeatingLinearGradient,u)||n("radial-gradient",t.radialGradient,b)||n("repeating-radial-gradient",t.repeatingRadialGradient,b)}function n(l,c,d){return a(c,function(y){var W=d();return W&&(x(t.comma)||r("Missing comma before color stops")),{type:l,orientation:W,colorStops:w(_e)}})}function a(l,c){var d=x(l);if(d){x(t.startCall)||r("Missing (");var y=c(d);return x(t.endCall)||r("Missing )"),y}}function u(){return f()||p()}function f(){return g("directional",t.sideOrCorner,1)}function p(){return g("angular",t.angleValue,1)}function b(){var l,c=m(),d;return c&&(l=[],l.push(c),d=e,x(t.comma)&&(c=m(),c?l.push(c):e=d)),l}function m(){var l=v()||xe();if(l)l.at=V();else{var c=D();if(c){l=c;var d=V();d&&(l.at=d)}else{var y=q();y&&(l={type:"default-radial",at:y})}}return l}function v(){var l=g("shape",/^(circle)/i,0);return l&&(l.style=B()||D()),l}function xe(){var l=g("shape",/^(ellipse)/i,0);return l&&(l.style=A()||D()),l}function D(){return g("extent-keyword",t.extentKeywords,1)}function V(){if(g("position",/^at/,0)){var l=q();return l||r("Missing positioning value"),l}}function q(){var l=ye();if(l.x||l.y)return{type:"position",value:l}}function ye(){return{x:A(),y:A()}}function w(l){var c=l(),d=[];if(c)for(d.push(c);x(t.comma);)c=l(),c?d.push(c):r("One extra comma");return d}function _e(){var l=be();return l||r("Expected color definition"),l.length=A(),l}function be(){return Se()||we()||Te()||Ce()}function Ce(){return g("literal",t.literalColor,0)}function Se(){return g("hex",t.hexColor,1)}function Te(){return a(t.rgbColor,function(){return{type:"rgb",value:w(G)}})}function we(){return a(t.rgbaColor,function(){return{type:"rgba",value:w(G)}})}function G(){return x(t.number)[1]}function A(){return g("%",t.percentageValue,1)||Ae()||B()}function Ae(){return g("position-keyword",t.positionKeywords,1)}function B(){return g("px",t.pixelValue,1)||g("em",t.emValue,1)}function g(l,c,d){var y=x(c);if(y)return{type:l,value:y[d]}}function x(l){var c,d;return d=/^[\n\r\t\s]+/.exec(e),d&&X(d[0].length),c=l.exec(e),c&&X(c[0].length),c}function X(l){e=e.substr(l)}return function(l){return e=l.toString(),i()}}();var qe=C.parse;C.stringify;var K={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},Y={red:0,orange:60,yellow:120,green:180,blue:240,purple:300};function Ge(t){var e,r=[],i=1,s;if(typeof t=="string")if(K[t])r=K[t].slice(),s="rgb";else if(t==="transparent")i=0,s="rgb",r=[0,0,0];else if(/^#[A-Fa-f0-9]+$/.test(t)){var o=t.slice(1),n=o.length,a=n<=4;i=1,a?(r=[parseInt(o[0]+o[0],16),parseInt(o[1]+o[1],16),parseInt(o[2]+o[2],16)],n===4&&(i=parseInt(o[3]+o[3],16)/255)):(r=[parseInt(o[0]+o[1],16),parseInt(o[2]+o[3],16),parseInt(o[4]+o[5],16)],n===8&&(i=parseInt(o[6]+o[7],16)/255)),r[0]||(r[0]=0),r[1]||(r[1]=0),r[2]||(r[2]=0),s="rgb"}else if(e=/^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(t)){var u=e[1],f=u==="rgb",o=u.replace(/a$/,"");s=o;var n=o==="cmyk"?4:o==="gray"?1:3;r=e[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(m,v){if(/%$/.test(m))return v===n?parseFloat(m)/100:o==="rgb"?parseFloat(m)*255/100:parseFloat(m);if(o[v]==="h"){if(/deg$/.test(m))return parseFloat(m);if(Y[m]!==void 0)return Y[m]}return parseFloat(m)}),u===o&&r.push(1),i=f||r[n]===void 0?1:r[n],r=r.slice(0,n)}else t.length>10&&/[0-9](?:\s|\/)/.test(t)&&(r=t.match(/([0-9]+)/g).map(function(p){return parseFloat(p)}),s=t.match(/([a-z])/ig).join("").toLowerCase());else isNaN(t)?Array.isArray(t)||t.length?(r=[t[0],t[1],t[2]],s="rgb",i=t.length===4?t[3]:1):t instanceof Object&&(t.r!=null||t.red!=null||t.R!=null?(s="rgb",r=[t.r||t.red||t.R||0,t.g||t.green||t.G||0,t.b||t.blue||t.B||0]):(s="hsl",r=[t.h||t.hue||t.H||0,t.s||t.saturation||t.S||0,t.l||t.lightness||t.L||t.b||t.brightness]),i=t.a||t.alpha||t.opacity||1,t.opacity!=null&&(i/=100)):(s="rgb",r=[t>>>16,(t&65280)>>>8,t&255]);return{space:s,values:r,alpha:i}}var I={name:"rgb",min:[0,0,0],max:[255,255,255],channel:["red","green","blue"],alias:["RGB"]},R={name:"hsl",min:[0,0,0],max:[360,100,100],channel:["hue","saturation","lightness"],alias:["HSL"],rgb:function(t){var e=t[0]/360,r=t[1]/100,i=t[2]/100,s,o,n,a,u;if(r===0)return u=i*255,[u,u,u];i<.5?o=i*(1+r):o=i+r-i*r,s=2*i-o,a=[0,0,0];for(var f=0;f<3;f++)n=e+1/3*-(f-1),n<0?n++:n>1&&n--,6*n<1?u=s+(o-s)*6*n:2*n<1?u=o:3*n<2?u=s+(o-s)*(2/3-n)*6:u=s,a[f]=u*255;return a}};I.hsl=function(t){var e=t[0]/255,r=t[1]/255,i=t[2]/255,s=Math.min(e,r,i),o=Math.max(e,r,i),n=o-s,a,u,f;return o===s?a=0:e===o?a=(r-i)/n:r===o?a=2+(i-e)/n:i===o&&(a=4+(e-r)/n),a=Math.min(a*60,360),a<0&&(a+=360),f=(s+o)/2,o===s?u=0:f<=.5?u=n/(o+s):u=n/(2-o-s),[a,u*100,f*100]};function Be(t){Array.isArray(t)&&t.raw&&(t=String.raw(...arguments));var e,r=Ge(t);if(!r.space)return[];const i=r.space[0]==="h"?R.min:I.min,s=r.space[0]==="h"?R.max:I.max;return e=Array(3),e[0]=Math.min(Math.max(r.values[0],i[0]),s[0]),e[1]=Math.min(Math.max(r.values[1],i[1]),s[1]),e[2]=Math.min(Math.max(r.values[2],i[2]),s[2]),r.space[0]==="h"&&(e=R.rgb(e)),e.push(Math.min(Math.max(r.alpha,0),1)),e}function ne(t){switch(typeof t){case"string":return Xe(t);case"number":return O(t);default:return t}}function Xe(t){const e=Be(t);if(!e)throw new Error(`Unable to parse color "${t}" as RGBA.`);return[e[0]/255,e[1]/255,e[2]/255,e[3]]}function We(t){const e=qe(tt(t));if(e.length===0)throw new Error("Invalid CSS gradient.");if(e.length!==1)throw new Error("Unsupported CSS gradient (multiple gradients is not supported).");const r=e[0],i=Ke(r.type),s=Ye(r.colorStops),o=Je(r.orientation);return{type:i,stops:s,angle:o}}function Ke(t){const e={"linear-gradient":0,"radial-gradient":1};if(!(t in e))throw new Error(`Unsupported gradient type "${t}"`);return e[t]}function Ye(t){const e=Qe(t),r=[];for(let i=0;i<t.length;i++){const s=Ue(t[i]);r.push({offset:e[i],color:s.slice(0,3),alpha:s[3]})}return r}function Ue(t){return ne(He(t))}function He(t){switch(t.type){case"hex":return`#${t.value}`;case"literal":return t.value;default:return`${t.type}(${t.value.join(",")})`}}function Qe(t){const e=[];for(let s=0;s<t.length;s++){const o=t[s];let n=-1;o.type==="literal"&&o.length&&"type"in o.length&&o.length.type==="%"&&"value"in o.length&&(n=parseFloat(o.length.value)/100),e.push(n)}const r=s=>{for(let o=s;o<e.length;o++)if(e[o]!==-1)return{indexDelta:o-s,offset:e[o]};return{indexDelta:e.length-1-s,offset:1}};let i=0;for(let s=0;s<e.length;s++){const o=e[s];if(o!==-1)i=o;else if(s===0)e[s]=0;else if(s+1===e.length)e[s]=1;else{const n=r(s),a=(n.offset-i)/(1+n.indexDelta);for(let u=0;u<=n.indexDelta;u++)e[s+u]=i+(u+1)*a;s+=n.indexDelta,i=e[s]}}return e.map(Ze)}function Ze(t){return t.toString().length>6?parseFloat(t.toString().substring(0,6)):t}function Je(t){if(typeof t>"u")return 0;if("type"in t&&"value"in t)switch(t.type){case"angular":return parseFloat(t.value);case"directional":return et(t.value)}return 0}function et(t){const e={left:270,top:0,bottom:180,right:90,"left top":315,"top left":315,"left bottom":225,"bottom left":225,"right top":45,"top right":45,"right bottom":135,"bottom right":135};if(!(t in e))throw new Error(`Unsupported directional value "${t}"`);return e[t]}function tt(t){let e=t.replace(/\s{2,}/gu," ");return e=e.replace(/;/g,""),e=e.replace(/ ,/g,","),e=e.replace(/\( /g,"("),e=e.replace(/ \)/g,")"),e.trim()}var rt=Object.defineProperty,it=Object.defineProperties,ot=Object.getOwnPropertyDescriptors,U=Object.getOwnPropertySymbols,st=Object.prototype.hasOwnProperty,nt=Object.prototype.propertyIsEnumerable,H=(t,e,r)=>e in t?rt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,L=(t,e)=>{for(var r in e||(e={}))st.call(e,r)&&H(t,r,e[r]);if(U)for(var r of U(e))nt.call(e,r)&&H(t,r,e[r]);return t},at=(t,e)=>it(t,ot(e));const Q=90;function lt(t){return[...t].sort((e,r)=>e.offset-r.offset)}const T=class extends h{constructor(t){var e,r;let i;if(t&&"css"in t?i=at(L({},We(t.css||"")),{alpha:(e=t.alpha)!=null?e:T.defaults.alpha,maxColors:(r=t.maxColors)!=null?r:T.defaults.maxColors}):i=L(L({},T.defaults),t),!i.stops||i.stops.length<2)throw new Error("ColorGradientFilter requires at least 2 color stops.");super(Ve,Ne),this._stops=[],this.autoFit=!1,Object.assign(this,i)}get stops(){return this._stops}set stops(t){const e=lt(t),r=new Float32Array(e.length*3),i=0,s=1,o=2;for(let n=0;n<e.length;n++){const a=ne(e[n].color),u=n*3;r[u+i]=a[i],r[u+s]=a[s],r[u+o]=a[o]}this.uniforms.uColors=r,this.uniforms.uOffsets=e.map(n=>n.offset),this.uniforms.uAlphas=e.map(n=>n.alpha),this.uniforms.uNumStops=e.length,this._stops=e}set type(t){this.uniforms.uType=t}get type(){return this.uniforms.uType}set angle(t){this.uniforms.uAngle=t-Q}get angle(){return this.uniforms.uAngle+Q}set alpha(t){this.uniforms.uAlpha=t}get alpha(){return this.uniforms.uAlpha}set maxColors(t){this.uniforms.uMaxColors=t}get maxColors(){return this.uniforms.uMaxColors}set replace(t){this.uniforms.uReplace=t}get replace(){return this.uniforms.uReplace}};let z=T;z.LINEAR=0,z.RADIAL=1,z.CONIC=2,z.defaults={type:T.LINEAR,stops:[{offset:0,color:16711680,alpha:1},{offset:1,color:255,alpha:1}],alpha:1,angle:90,maxColors:0,replace:!1};var ut=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,ct=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

const float SQRT_2 = 1.414213;

const float light = 1.0;

uniform float curvature;
uniform float lineWidth;
uniform float lineContrast;
uniform bool verticalLine;
uniform float noise;
uniform float noiseSize;

uniform float vignetting;
uniform float vignettingAlpha;
uniform float vignettingBlur;

uniform float seed;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 dir = vec2(vTextureCoord.xy * filterArea.xy / dimensions - vec2(0.5, 0.5));
    
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 rgb = gl_FragColor.rgb;

    if (noise > 0.0 && noiseSize > 0.0)
    {
        pixelCoord.x = floor(pixelCoord.x / noiseSize);
        pixelCoord.y = floor(pixelCoord.y / noiseSize);
        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
        rgb += _noise * noise;
    }

    if (lineWidth > 0.0)
    {
        float _c = curvature > 0. ? curvature : 1.;
        float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;
        vec2 uv = dir * k;

        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;
        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;
        rgb *= j;
        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);
        rgb *= 0.99 + ceil(segment) * 0.015;
    }

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
    }

    gl_FragColor.rgb = rgb;
}
`;const ae=class extends h{constructor(e){super(ut,ct),this.time=0,this.seed=0,this.uniforms.dimensions=new Float32Array(2),Object.assign(this,ae.defaults,e)}apply(e,r,i,s){const{width:o,height:n}=r.filterFrame;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=n,this.uniforms.seed=this.seed,this.uniforms.time=this.time,e.applyFilter(this,r,i,s)}set curvature(e){this.uniforms.curvature=e}get curvature(){return this.uniforms.curvature}set lineWidth(e){this.uniforms.lineWidth=e}get lineWidth(){return this.uniforms.lineWidth}set lineContrast(e){this.uniforms.lineContrast=e}get lineContrast(){return this.uniforms.lineContrast}set verticalLine(e){this.uniforms.verticalLine=e}get verticalLine(){return this.uniforms.verticalLine}set noise(e){this.uniforms.noise=e}get noise(){return this.uniforms.noise}set noiseSize(e){this.uniforms.noiseSize=e}get noiseSize(){return this.uniforms.noiseSize}set vignetting(e){this.uniforms.vignetting=e}get vignetting(){return this.uniforms.vignetting}set vignettingAlpha(e){this.uniforms.vignettingAlpha=e}get vignettingAlpha(){return this.uniforms.vignettingAlpha}set vignettingBlur(e){this.uniforms.vignettingBlur=e}get vignettingBlur(){return this.uniforms.vignettingBlur}};let ft=ae;ft.defaults={curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,seed:0,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0};var dt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,ht=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
uniform vec3 color;

uniform vec2 shift;
uniform vec4 inputSize;

void main(void){
    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);

    // Premultiply alpha
    sample.rgb = color.rgb * sample.a;

    // alpha user alpha
    sample *= alpha;

    gl_FragColor = sample;
}`,mt=Object.defineProperty,Z=Object.getOwnPropertySymbols,gt=Object.prototype.hasOwnProperty,pt=Object.prototype.propertyIsEnumerable,J=(t,e,r)=>e in t?mt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,ee=(t,e)=>{for(var r in e||(e={}))gt.call(e,r)&&J(t,r,e[r]);if(Z)for(var r of Z(e))pt.call(e,r)&&J(t,r,e[r]);return t};const j=class extends h{constructor(e){super(),this.angle=45,this._distance=5,this._resolution=k.FILTER_RESOLUTION;const r=e?ee(ee({},j.defaults),e):j.defaults,{kernels:i,blur:s,quality:o,pixelSize:n,resolution:a}=r;this._offset=new ze(this._updatePadding,this),this._tintFilter=new h(dt,ht),this._tintFilter.uniforms.color=new Float32Array(4),this._tintFilter.uniforms.shift=this._offset,this._tintFilter.resolution=a,this._blurFilter=i?new M(i):new M(s,o),this.pixelSize=n,this.resolution=a;const{shadowOnly:u,rotation:f,distance:p,offset:b,alpha:m,color:v}=r;this.shadowOnly=u,f!==void 0&&p!==void 0?(this.rotation=f,this.distance=p):this.offset=b,this.alpha=m,this.color=v}apply(e,r,i,s){const o=e.getFilterTexture();this._tintFilter.apply(e,r,o,1),this._blurFilter.apply(e,o,i,s),this.shadowOnly!==!0&&e.applyFilter(this,r,i,0),e.returnFilterTexture(o)}_updatePadding(){const e=Math.max(Math.abs(this._offset.x),Math.abs(this._offset.y));this.padding=e+this.blur*2}_updateShift(){this._tintFilter.uniforms.shift.set(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle))}set offset(e){this._offset.copyFrom(e),this._updatePadding()}get offset(){return this._offset}get resolution(){return this._resolution}set resolution(e){this._resolution=e,this._tintFilter&&(this._tintFilter.resolution=e),this._blurFilter&&(this._blurFilter.resolution=e)}get distance(){return this._distance}set distance(e){E("5.3.0","DropShadowFilter distance is deprecated, use offset"),this._distance=e,this._updatePadding(),this._updateShift()}get rotation(){return this.angle/F}set rotation(e){E("5.3.0","DropShadowFilter rotation is deprecated, use offset"),this.angle=e*F,this._updateShift()}get alpha(){return this._tintFilter.uniforms.alpha}set alpha(e){this._tintFilter.uniforms.alpha=e}get color(){return N(this._tintFilter.uniforms.color)}set color(e){O(e,this._tintFilter.uniforms.color)}get kernels(){return this._blurFilter.kernels}set kernels(e){this._blurFilter.kernels=e}get blur(){return this._blurFilter.blur}set blur(e){this._blurFilter.blur=e,this._updatePadding()}get quality(){return this._blurFilter.quality}set quality(e){this._blurFilter.quality=e}get pixelSize(){return this._blurFilter.pixelSize}set pixelSize(e){this._blurFilter.pixelSize=e}};let vt=j;vt.defaults={offset:{x:4,y:4},color:0,alpha:.5,shadowOnly:!1,kernels:null,blur:2,quality:3,pixelSize:1,resolution:k.FILTER_RESOLUTION};var xt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,yt=`// precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;
uniform float aspect;

uniform sampler2D displacementMap;
uniform float offset;
uniform float sinDir;
uniform float cosDir;
uniform int fillMode;

uniform float seed;
uniform vec2 red;
uniform vec2 green;
uniform vec2 blue;

const int TRANSPARENT = 0;
const int ORIGINAL = 1;
const int LOOP = 2;
const int CLAMP = 3;
const int MIRROR = 4;

void main(void)
{
    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;

    if (coord.x > 1.0 || coord.y > 1.0) {
        return;
    }

    float cx = coord.x - 0.5;
    float cy = (coord.y - 0.5) * aspect;
    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;

    // displacementMap: repeat
    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);

    // displacementMap: mirror
    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);

    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));

    float displacement = (dc.r - dc.g) * (offset / filterArea.x);

    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);

    if (fillMode == CLAMP) {
        coord = clamp(coord, filterClamp.xy, filterClamp.zw);
    } else {
        if( coord.x > filterClamp.z ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.x -= filterClamp.z;
            } else if (fillMode == MIRROR) {
                coord.x = filterClamp.z * 2.0 - coord.x;
            }
        } else if( coord.x < filterClamp.x ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.x += filterClamp.z;
            } else if (fillMode == MIRROR) {
                coord.x *= -filterClamp.z;
            }
        }

        if( coord.y > filterClamp.w ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.y -= filterClamp.w;
            } else if (fillMode == MIRROR) {
                coord.y = filterClamp.w * 2.0 - coord.y;
            }
        } else if( coord.y < filterClamp.y ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.y += filterClamp.w;
            } else if (fillMode == MIRROR) {
                coord.y *= -filterClamp.w;
            }
        }
    }

    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;
    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;
    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;
    gl_FragColor.a = texture2D(uSampler, coord).a;
}
`;const $=class extends h{constructor(e){super(xt,yt),this.offset=100,this.fillMode=$.TRANSPARENT,this.average=!1,this.seed=0,this.minSize=8,this.sampleSize=512,this._slices=0,this._offsets=new Float32Array(1),this._sizes=new Float32Array(1),this._direction=-1,this.uniforms.dimensions=new Float32Array(2),this._canvas=document.createElement("canvas"),this._canvas.width=4,this._canvas.height=this.sampleSize,this.texture=Pe.from(this._canvas,{scaleMode:Fe.NEAREST}),Object.assign(this,$.defaults,e)}apply(e,r,i,s){const{width:o,height:n}=r.filterFrame;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=n,this.uniforms.aspect=n/o,this.uniforms.seed=this.seed,this.uniforms.offset=this.offset,this.uniforms.fillMode=this.fillMode,e.applyFilter(this,r,i,s)}_randomizeSizes(){const e=this._sizes,r=this._slices-1,i=this.sampleSize,s=Math.min(this.minSize/i,.9/this._slices);if(this.average){const o=this._slices;let n=1;for(let a=0;a<r;a++){const u=n/(o-a),f=Math.max(u*(1-Math.random()*.6),s);e[a]=f,n-=f}e[r]=n}else{let o=1;const n=Math.sqrt(1/this._slices);for(let a=0;a<r;a++){const u=Math.max(n*o*Math.random(),s);e[a]=u,o-=u}e[r]=o}this.shuffle()}shuffle(){const e=this._sizes,r=this._slices-1;for(let i=r;i>0;i--){const s=Math.random()*i>>0,o=e[i];e[i]=e[s],e[s]=o}}_randomizeOffsets(){for(let e=0;e<this._slices;e++)this._offsets[e]=Math.random()*(Math.random()<.5?-1:1)}refresh(){this._randomizeSizes(),this._randomizeOffsets(),this.redraw()}redraw(){const e=this.sampleSize,r=this.texture,i=this._canvas.getContext("2d");i.clearRect(0,0,8,e);let s,o=0;for(let n=0;n<this._slices;n++){s=Math.floor(this._offsets[n]*256);const a=this._sizes[n]*e,u=s>0?s:0,f=s<0?-s:0;i.fillStyle=`rgba(${u}, ${f}, 0, 1)`,i.fillRect(0,o>>0,e,a+1>>0),o+=a}r.baseTexture.update(),this.uniforms.displacementMap=r}set sizes(e){const r=Math.min(this._slices,e.length);for(let i=0;i<r;i++)this._sizes[i]=e[i]}get sizes(){return this._sizes}set offsets(e){const r=Math.min(this._slices,e.length);for(let i=0;i<r;i++)this._offsets[i]=e[i]}get offsets(){return this._offsets}get slices(){return this._slices}set slices(e){this._slices!==e&&(this._slices=e,this.uniforms.slices=e,this._sizes=this.uniforms.slicesWidth=new Float32Array(e),this._offsets=this.uniforms.slicesOffset=new Float32Array(e),this.refresh())}get direction(){return this._direction}set direction(e){if(this._direction===e)return;this._direction=e;const r=e*F;this.uniforms.sinDir=Math.sin(r),this.uniforms.cosDir=Math.cos(r)}get red(){return this.uniforms.red}set red(e){this.uniforms.red=e}get green(){return this.uniforms.green}set green(e){this.uniforms.green=e}get blue(){return this.uniforms.blue}set blue(e){this.uniforms.blue=e}destroy(){var e;(e=this.texture)==null||e.destroy(!0),this.texture=this._canvas=this.red=this.green=this.blue=this._sizes=this._offsets=null}};let S=$;S.defaults={slices:5,offset:100,direction:0,fillMode:0,average:!1,seed:0,red:[0,0],green:[0,0],blue:[0,0],minSize:8,sampleSize:512},S.TRANSPARENT=0,S.ORIGINAL=1,S.LOOP=2,S.CLAMP=3,S.MIRROR=4;var _t=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,bt=`varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float outerStrength;
uniform float innerStrength;

uniform vec4 glowColor;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform bool knockout;
uniform float alpha;

const float PI = 3.14159265358979323846264;

const float DIST = __DIST__;
const float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);
const float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);

const float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;

void main(void) {
    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

    float totalAlpha = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {
           displaced = clamp(vTextureCoord + direction * 
                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);

           curColor = texture2D(uSampler, displaced);

           totalAlpha += (DIST - curDistance) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);

    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;
    float innerGlowStrength = min(1.0, innerGlowAlpha);
    
    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);

    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);
    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);

    if (knockout) {
      float resultAlpha = (outerGlowAlpha + innerGlowAlpha) * alpha;
      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);
    }
    else {
      vec4 outerGlowColor = outerGlowStrength * glowColor.rgba * alpha;
      gl_FragColor = innerColor + outerGlowColor;
    }
}
`;const le=class extends h{constructor(t){const e=Object.assign({},le.defaults,t),{outerStrength:r,innerStrength:i,color:s,knockout:o,quality:n,alpha:a}=e,u=Math.round(e.distance);super(_t,bt.replace(/__ANGLE_STEP_SIZE__/gi,`${(1/n/u).toFixed(7)}`).replace(/__DIST__/gi,`${u.toFixed(0)}.0`)),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.uniforms.alpha=1,Object.assign(this,{color:s,outerStrength:r,innerStrength:i,padding:u,knockout:o,alpha:a})}get color(){return N(this.uniforms.glowColor)}set color(t){O(t,this.uniforms.glowColor)}get outerStrength(){return this.uniforms.outerStrength}set outerStrength(t){this.uniforms.outerStrength=t}get innerStrength(){return this.uniforms.innerStrength}set innerStrength(t){this.uniforms.innerStrength=t}get knockout(){return this.uniforms.knockout}set knockout(t){this.uniforms.knockout=t}get alpha(){return this.uniforms.alpha}set alpha(t){this.uniforms.alpha=t}};let Ct=le;Ct.defaults={distance:10,outerStrength:4,innerStrength:0,color:16777215,quality:.1,knockout:!1,alpha:1};var St=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Tt=`vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x)
{
    return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}
float turb(vec3 P, vec3 rep, float lacunarity, float gain)
{
    float sum = 0.0;
    float sc = 1.0;
    float totalgain = 1.0;
    for (float i = 0.0; i < 6.0; i++)
    {
        sum += totalgain * pnoise(P * sc, rep);
        sc *= lacunarity;
        totalgain *= gain;
    }
    return abs(sum);
}
`,wt=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform vec2 light;
uniform bool parallel;
uniform float aspect;

uniform float gain;
uniform float lacunarity;
uniform float time;
uniform float alpha;

\${perlin}

void main(void) {
    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

    float d;

    if (parallel) {
        float _cos = light.x;
        float _sin = light.y;
        d = (_cos * coord.x) + (_sin * coord.y * aspect);
    } else {
        float dx = coord.x - light.x / dimensions.x;
        float dy = (coord.y - light.y / dimensions.y) * aspect;
        float dis = sqrt(dx * dx + dy * dy) + 0.00001;
        d = dy / dis;
    }

    vec3 dir = vec3(d, d, 0.0);

    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);
    noise = mix(noise, 0.0, 0.3);
    //fade vertically.
    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);
    mist.a = 1.0;
    // apply user alpha
    mist *= alpha;

    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;

}
`;const ue=class extends h{constructor(e){super(St,wt.replace("${perlin}",Tt)),this.parallel=!0,this.time=0,this._angle=0,this.uniforms.dimensions=new Float32Array(2);const r=Object.assign(ue.defaults,e);this._angleLight=new _,this.angle=r.angle,this.gain=r.gain,this.lacunarity=r.lacunarity,this.alpha=r.alpha,this.parallel=r.parallel,this.center=r.center,this.time=r.time}apply(e,r,i,s){const{width:o,height:n}=r.filterFrame;this.uniforms.light=this.parallel?this._angleLight:this.center,this.uniforms.parallel=this.parallel,this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=n,this.uniforms.aspect=n/o,this.uniforms.time=this.time,this.uniforms.alpha=this.alpha,e.applyFilter(this,r,i,s)}get angle(){return this._angle}set angle(e){this._angle=e;const r=e*F;this._angleLight.x=Math.cos(r),this._angleLight.y=Math.sin(r)}get gain(){return this.uniforms.gain}set gain(e){this.uniforms.gain=e}get lacunarity(){return this.uniforms.lacunarity}set lacunarity(e){this.uniforms.lacunarity=e}get alpha(){return this.uniforms.alpha}set alpha(e){this.uniforms.alpha=e}};let At=ue;At.defaults={angle:30,gain:.5,lacunarity:2.5,time:0,parallel:!0,center:[0,0],alpha:1};var zt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Pt=`precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uHue;
uniform float uAlpha;
uniform bool uColorize;
uniform float uSaturation;
uniform float uLightness;

// https://en.wikipedia.org/wiki/Luma_(video)
const vec3 weight = vec3(0.299, 0.587, 0.114);

float getWeightedAverage(vec3 rgb) {
    return rgb.r * weight.r + rgb.g * weight.g + rgb.b * weight.b;
}

// https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786?permalink_comment_id=3195243#gistcomment-3195243
const vec3 k = vec3(0.57735, 0.57735, 0.57735);

vec3 hueShift(vec3 color, float angle) {
    float cosAngle = cos(angle);
    return vec3(
    color * cosAngle +
    cross(k, color) * sin(angle) +
    k * dot(k, color) * (1.0 - cosAngle)
    );
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec4 result = color;

    // colorize
    if (uColorize) {
        result.rgb = vec3(getWeightedAverage(result.rgb), 0., 0.);
    }

    // hue
    result.rgb = hueShift(result.rgb, uHue);

    // saturation
    // https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/huesaturation.js
    float average = (result.r + result.g + result.b) / 3.0;

    if (uSaturation > 0.) {
        result.rgb += (average - result.rgb) * (1. - 1. / (1.001 - uSaturation));
    } else {
        result.rgb -= (average - result.rgb) * uSaturation;
    }

    // lightness
    result.rgb = mix(result.rgb, vec3(ceil(uLightness)) * color.a, abs(uLightness));

    // alpha
    gl_FragColor = mix(color, result, uAlpha);
}
`;const ce=class extends h{constructor(t){super(zt,Pt),this._hue=0;const e=Object.assign({},ce.defaults,t);Object.assign(this,e)}get hue(){return this._hue}set hue(t){this._hue=t,this.uniforms.uHue=this._hue*(Math.PI/180)}get alpha(){return this.uniforms.uAlpha}set alpha(t){this.uniforms.uAlpha=t}get colorize(){return this.uniforms.uColorize}set colorize(t){this.uniforms.uColorize=t}get lightness(){return this.uniforms.uLightness}set lightness(t){this.uniforms.uLightness=t}get saturation(){return this.uniforms.uSaturation}set saturation(t){this.uniforms.uSaturation=t}};let Ft=ce;Ft.defaults={hue:0,saturation:0,lightness:0,colorize:!1,alpha:1};var Mt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,kt=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float sepia;
uniform float noise;
uniform float noiseSize;
uniform float scratch;
uniform float scratchDensity;
uniform float scratchWidth;
uniform float vignetting;
uniform float vignettingAlpha;
uniform float vignettingBlur;
uniform float seed;

const float SQRT_2 = 1.414213;
const vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 Overlay(vec3 src, vec3 dst)
{
    // if (dst <= 0.5) then: 2 * src * dst
    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)
    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),
                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),
                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
}


void main()
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 color = gl_FragColor.rgb;

    if (sepia > 0.0)
    {
        float gray = (color.x + color.y + color.z) / 3.0;
        vec3 grayscale = vec3(gray);

        color = Overlay(SEPIA_RGB, grayscale);

        color = grayscale + sepia * (color - grayscale);
    }

    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        vec2 dir = vec2(vec2(0.5, 0.5) - coord);
        dir.y *= dimensions.y / dimensions.x;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
    }

    if (scratchDensity > seed && scratch != 0.0)
    {
        float phase = seed * 256.0;
        float s = mod(floor(phase), 2.0);
        float dist = 1.0 / scratchDensity;
        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));
        if (d < seed * 0.6 + 0.4)
        {
            highp float period = scratchDensity * 10.0;

            float xx = coord.x * period + phase;
            float aa = abs(mod(xx, 0.5) * 4.0);
            float bb = mod(floor(xx / 0.5), 2.0);
            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);

            float kk = 2.0 * period;
            float dw = scratchWidth / dimensions.x * (0.75 + seed);
            float dh = dw * kk;

            float tine = (yy - (2.0 - dh));

            if (tine > 0.0) {
                float _sign = sign(scratch);

                tine = s * tine / period + scratch + 0.1;
                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);

                color.rgb *= tine;
            }
        }
    }

    if (noise > 0.0 && noiseSize > 0.0)
    {
        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
        pixelCoord.x = floor(pixelCoord.x / noiseSize);
        pixelCoord.y = floor(pixelCoord.y / noiseSize);
        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);
        // float _noise = snoise(d) * 0.5;
        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
        color += _noise * noise;
    }

    gl_FragColor.rgb = color;
}
`;const fe=class extends h{constructor(e,r=0){super(Mt,kt),this.seed=0,this.uniforms.dimensions=new Float32Array(2),typeof e=="number"?(this.seed=e,e=void 0):this.seed=r,Object.assign(this,fe.defaults,e)}apply(e,r,i,s){var o,n;this.uniforms.dimensions[0]=(o=r.filterFrame)==null?void 0:o.width,this.uniforms.dimensions[1]=(n=r.filterFrame)==null?void 0:n.height,this.uniforms.seed=this.seed,e.applyFilter(this,r,i,s)}set sepia(e){this.uniforms.sepia=e}get sepia(){return this.uniforms.sepia}set noise(e){this.uniforms.noise=e}get noise(){return this.uniforms.noise}set noiseSize(e){this.uniforms.noiseSize=e}get noiseSize(){return this.uniforms.noiseSize}set scratch(e){this.uniforms.scratch=e}get scratch(){return this.uniforms.scratch}set scratchDensity(e){this.uniforms.scratchDensity=e}get scratchDensity(){return this.uniforms.scratchDensity}set scratchWidth(e){this.uniforms.scratchWidth=e}get scratchWidth(){return this.uniforms.scratchWidth}set vignetting(e){this.uniforms.vignetting=e}get vignetting(){return this.uniforms.vignetting}set vignettingAlpha(e){this.uniforms.vignettingAlpha=e}get vignettingAlpha(){return this.uniforms.vignettingAlpha}set vignettingBlur(e){this.uniforms.vignettingBlur=e}get vignettingBlur(){return this.uniforms.vignettingBlur}};let Ot=fe;Ot.defaults={sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3};var Dt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Rt=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterClamp;

uniform float uAlpha;
uniform vec2 uThickness;
uniform vec4 uColor;
uniform bool uKnockout;

const float DOUBLE_PI = 2. * 3.14159265358979323846264;
const float ANGLE_STEP = \${angleStep};

float outlineMaxAlphaAtPos(vec2 pos) {
    if (uThickness.x == 0. || uThickness.y == 0.) {
        return 0.;
    }

    vec4 displacedColor;
    vec2 displacedPos;
    float maxAlpha = 0.;

    for (float angle = 0.; angle <= DOUBLE_PI; angle += ANGLE_STEP) {
        displacedPos.x = vTextureCoord.x + uThickness.x * cos(angle);
        displacedPos.y = vTextureCoord.y + uThickness.y * sin(angle);
        displacedColor = texture2D(uSampler, clamp(displacedPos, filterClamp.xy, filterClamp.zw));
        maxAlpha = max(maxAlpha, displacedColor.a);
    }

    return maxAlpha;
}

void main(void) {
    vec4 sourceColor = texture2D(uSampler, vTextureCoord);
    vec4 contentColor = sourceColor * float(!uKnockout);
    float outlineAlpha = uAlpha * outlineMaxAlphaAtPos(vTextureCoord.xy) * (1.-sourceColor.a);
    vec4 outlineColor = vec4(vec3(uColor) * outlineAlpha, outlineAlpha);
    gl_FragColor = contentColor + outlineColor;
}
`;const P=class extends h{constructor(e=1,r=0,i=.1,s=1,o=!1){super(Dt,Rt.replace(/\$\{angleStep\}/,P.getAngleStep(i))),this._thickness=1,this._alpha=1,this._knockout=!1,this.uniforms.uThickness=new Float32Array([0,0]),this.uniforms.uColor=new Float32Array([0,0,0,1]),this.uniforms.uAlpha=s,this.uniforms.uKnockout=o,Object.assign(this,{thickness:e,color:r,quality:i,alpha:s,knockout:o})}static getAngleStep(e){const r=Math.max(e*P.MAX_SAMPLES,P.MIN_SAMPLES);return(Math.PI*2/r).toFixed(7)}apply(e,r,i,s){this.uniforms.uThickness[0]=this._thickness/r._frame.width,this.uniforms.uThickness[1]=this._thickness/r._frame.height,this.uniforms.uAlpha=this._alpha,this.uniforms.uKnockout=this._knockout,e.applyFilter(this,r,i,s)}get alpha(){return this._alpha}set alpha(e){this._alpha=e}get color(){return N(this.uniforms.uColor)}set color(e){O(e,this.uniforms.uColor)}get knockout(){return this._knockout}set knockout(e){this._knockout=e}get thickness(){return this._thickness}set thickness(e){this._thickness=e,this.padding=e}};let te=P;te.MIN_SAMPLES=1,te.MAX_SAMPLES=100;var Lt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Et=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

uniform bool mirror;
uniform float boundary;
uniform vec2 amplitude;
uniform vec2 waveLength;
uniform vec2 alpha;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    if (coord.y < boundary) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    float k = (coord.y - boundary) / (1. - boundary + 0.0001);
    float areaY = boundary * dimensions.y / filterArea.y;
    float v = areaY + areaY - vTextureCoord.y;
    float y = mirror ? v : vTextureCoord.y;

    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;
    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;
    float _alpha = (alpha.y - alpha.x) * k + alpha.x;

    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;
    x = clamp(x, filterClamp.x, filterClamp.z);

    vec4 color = texture2D(uSampler, vec2(x, y));

    gl_FragColor = color * _alpha;
}
`;const de=class extends h{constructor(e){super(Lt,Et),this.time=0,this.uniforms.amplitude=new Float32Array(2),this.uniforms.waveLength=new Float32Array(2),this.uniforms.alpha=new Float32Array(2),this.uniforms.dimensions=new Float32Array(2),Object.assign(this,de.defaults,e)}apply(e,r,i,s){var o,n;this.uniforms.dimensions[0]=(o=r.filterFrame)==null?void 0:o.width,this.uniforms.dimensions[1]=(n=r.filterFrame)==null?void 0:n.height,this.uniforms.time=this.time,e.applyFilter(this,r,i,s)}set mirror(e){this.uniforms.mirror=e}get mirror(){return this.uniforms.mirror}set boundary(e){this.uniforms.boundary=e}get boundary(){return this.uniforms.boundary}set amplitude(e){this.uniforms.amplitude[0]=e[0],this.uniforms.amplitude[1]=e[1]}get amplitude(){return this.uniforms.amplitude}set waveLength(e){this.uniforms.waveLength[0]=e[0],this.uniforms.waveLength[1]=e[1]}get waveLength(){return this.uniforms.waveLength}set alpha(e){this.uniforms.alpha[0]=e[0],this.uniforms.alpha[1]=e[1]}get alpha(){return this.uniforms.alpha}};let It=de;It.defaults={mirror:!0,boundary:.5,amplitude:[0,20],waveLength:[30,100],alpha:[1,1],time:0};var jt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,$t=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 center;

uniform float amplitude;
uniform float wavelength;
// uniform float power;
uniform float brightness;
uniform float speed;
uniform float radius;

uniform float time;

const float PI = 3.14159;

void main()
{
    float halfWavelength = wavelength * 0.5 / filterArea.x;
    float maxRadius = radius / filterArea.x;
    float currentRadius = time * speed / filterArea.x;

    float fade = 1.0;

    if (maxRadius > 0.0) {
        if (currentRadius > maxRadius) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);
    }

    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);
    dir.y *= filterArea.y / filterArea.x;
    float dist = length(dir);

    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    vec2 diffUV = normalize(dir);

    float diff = (dist - currentRadius) / halfWavelength;

    float p = 1.0 - pow(abs(diff), 2.0);

    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );
    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );

    vec2 offset = diffUV * powDiff / filterArea.xy;

    // Do clamp :
    vec2 coord = vTextureCoord + offset;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    // No clamp :
    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);

    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;

    gl_FragColor = color;
}
`;const he=class extends h{constructor(e=[0,0],r,i=0){super(jt,$t),this.center=e,Object.assign(this,he.defaults,r),this.time=i}apply(e,r,i,s){this.uniforms.time=this.time,e.applyFilter(this,r,i,s)}get center(){return this.uniforms.center}set center(e){this.uniforms.center=e}get amplitude(){return this.uniforms.amplitude}set amplitude(e){this.uniforms.amplitude=e}get wavelength(){return this.uniforms.wavelength}set wavelength(e){this.uniforms.wavelength=e}get brightness(){return this.uniforms.brightness}set brightness(e){this.uniforms.brightness=e}get speed(){return this.uniforms.speed}set speed(e){this.uniforms.speed=e}get radius(){return this.uniforms.radius}set radius(e){this.uniforms.radius=e}};let Nt=he;Nt.defaults={amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1};var Vt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,qt=`varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float blur;
uniform float gradientBlur;
uniform vec2 start;
uniform vec2 end;
uniform vec2 delta;
uniform vec2 texSize;

float random(vec3 scale, float seed)
{
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main(void)
{
    vec4 color = vec4(0.0);
    float total = 0.0;

    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));
    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;

    for (float t = -30.0; t <= 30.0; t++)
    {
        float percent = (t + offset - 0.5) / 30.0;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);
        sample.rgb *= sample.a;
        color += sample * weight;
        total += weight;
    }

    color /= total;
    color.rgb /= color.a + 0.00001;

    gl_FragColor = color;
}
`;let me=class extends h{constructor(e){var r,i;super(Vt,qt),this.uniforms.blur=e.blur,this.uniforms.gradientBlur=e.gradientBlur,this.uniforms.start=(r=e.start)!=null?r:new _(0,window.innerHeight/2),this.uniforms.end=(i=e.end)!=null?i:new _(600,window.innerHeight/2),this.uniforms.delta=new _(30,30),this.uniforms.texSize=new _(window.innerWidth,window.innerHeight),this.updateDelta()}updateDelta(){this.uniforms.delta.x=0,this.uniforms.delta.y=0}get blur(){return this.uniforms.blur}set blur(e){this.uniforms.blur=e}get gradientBlur(){return this.uniforms.gradientBlur}set gradientBlur(e){this.uniforms.gradientBlur=e}get start(){return this.uniforms.start}set start(e){this.uniforms.start=e,this.updateDelta()}get end(){return this.uniforms.end}set end(e){this.uniforms.end=e,this.updateDelta()}},Gt=class extends me{updateDelta(){const e=this.uniforms.end.x-this.uniforms.start.x,r=this.uniforms.end.y-this.uniforms.start.y,i=Math.sqrt(e*e+r*r);this.uniforms.delta.x=e/i,this.uniforms.delta.y=r/i}},Bt=class extends me{updateDelta(){const e=this.uniforms.end.x-this.uniforms.start.x,r=this.uniforms.end.y-this.uniforms.start.y,i=Math.sqrt(e*e+r*r);this.uniforms.delta.x=-r/i,this.uniforms.delta.y=e/i}};const ge=class extends h{constructor(e,r,i,s){super(),typeof e=="number"&&(E("5.3.0","TiltShiftFilter constructor arguments is deprecated, use options."),e={blur:e,gradientBlur:r,start:i,end:s}),e=Object.assign({},ge.defaults,e),this.tiltShiftXFilter=new Gt(e),this.tiltShiftYFilter=new Bt(e)}apply(e,r,i,s){const o=e.getFilterTexture();this.tiltShiftXFilter.apply(e,r,o,1),this.tiltShiftYFilter.apply(e,o,i,s),e.returnFilterTexture(o)}get blur(){return this.tiltShiftXFilter.blur}set blur(e){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=e}get gradientBlur(){return this.tiltShiftXFilter.gradientBlur}set gradientBlur(e){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=e}get start(){return this.tiltShiftXFilter.start}set start(e){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=e}get end(){return this.tiltShiftXFilter.end}set end(e){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=e}};let Xt=ge;Xt.defaults={blur:100,gradientBlur:600,start:void 0,end:void 0};var Wt=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Kt=`varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float radius;
uniform float angle;
uniform vec2 offset;
uniform vec4 filterArea;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

vec2 twist(vec2 coord)
{
    coord -= offset;

    float dist = length(coord);

    if (dist < radius)
    {
        float ratioDist = (radius - dist) / radius;
        float angleMod = ratioDist * ratioDist * angle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
    }

    coord += offset;

    return coord;
}

void main(void)
{

    vec2 coord = mapCoord(vTextureCoord);

    coord = twist(coord);

    coord = unmapCoord(coord);

    gl_FragColor = texture2D(uSampler, coord );

}
`;const pe=class extends h{constructor(t){super(Wt,Kt),Object.assign(this,pe.defaults,t)}get offset(){return this.uniforms.offset}set offset(t){this.uniforms.offset=t}get radius(){return this.uniforms.radius}set radius(t){this.uniforms.radius=t}get angle(){return this.uniforms.angle}set angle(t){this.uniforms.angle=t}};let Yt=pe;Yt.defaults={radius:200,angle:4,padding:20,offset:new _};var Ut=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,Ht=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform vec2 uCenter;
uniform float uStrength;
uniform float uInnerRadius;
uniform float uRadius;

const float MAX_KERNEL_SIZE = \${maxKernelSize};

// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co, float seed) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);
    return fract(sin(sn) * c + seed);
}

void main() {

    float minGradient = uInnerRadius * 0.3;
    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;

    float gradient = uRadius * 0.3;
    float radius = (uRadius - gradient * 0.5) / filterArea.x;

    float countLimit = MAX_KERNEL_SIZE;

    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);
    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));

    float strength = uStrength;

    float delta = 0.0;
    float gap;
    if (dist < innerRadius) {
        delta = innerRadius - dist;
        gap = minGradient;
    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity
        delta = dist - radius;
        gap = gradient;
    }

    if (delta > 0.0) {
        float normalCount = gap / filterArea.x;
        delta = (normalCount - delta) / normalCount;
        countLimit *= delta;
        strength *= delta;
        if (countLimit < 1.0)
        {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
    }

    // randomize the lookup values to hide the fixed number of samples
    float offset = rand(vTextureCoord, 0.0);

    float total = 0.0;
    vec4 color = vec4(0.0);

    dir *= strength;

    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {
        float percent = (t + offset) / MAX_KERNEL_SIZE;
        float weight = 4.0 * (percent - percent * percent);
        vec2 p = vTextureCoord + dir * percent;
        vec4 sample = texture2D(uSampler, p);

        // switch to pre-multiplied alpha to correctly blur transparent images
        // sample.rgb *= sample.a;

        color += sample * weight;
        total += weight;

        if (t > countLimit){
            break;
        }
    }

    color /= total;
    // switch back from pre-multiplied alpha
    // color.rgb /= color.a + 0.00001;

    gl_FragColor = color;
}
`,re=Object.getOwnPropertySymbols,Qt=Object.prototype.hasOwnProperty,Zt=Object.prototype.propertyIsEnumerable,Jt=(t,e)=>{var r={};for(var i in t)Qt.call(t,i)&&e.indexOf(i)<0&&(r[i]=t[i]);if(t!=null&&re)for(var i of re(t))e.indexOf(i)<0&&Zt.call(t,i)&&(r[i]=t[i]);return r};const ve=class extends h{constructor(t){const e=Object.assign(ve.defaults,t),{maxKernelSize:r}=e,i=Jt(e,["maxKernelSize"]);super(Ut,Ht.replace("${maxKernelSize}",r.toFixed(1))),Object.assign(this,i)}get center(){return this.uniforms.uCenter}set center(t){this.uniforms.uCenter=t}get strength(){return this.uniforms.uStrength}set strength(t){this.uniforms.uStrength=t}get innerRadius(){return this.uniforms.uInnerRadius}set innerRadius(t){this.uniforms.uInnerRadius=t}get radius(){return this.uniforms.uRadius}set radius(t){(t<0||t===1/0)&&(t=-1),this.uniforms.uRadius=t}};let er=ve;er.defaults={strength:.1,center:[0,0],innerRadius:0,radius:-1,maxKernelSize:32};
