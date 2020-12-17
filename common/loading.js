var React  = require('react');

const svgSources = {
    'balls': "<svg class=\"icon-loading\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">\n" +
        "  <path transform=\"translate(-8 0)\" d=\"M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12\"> \n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"-8 0; 2 0; 2 0;\" dur=\"0.8s\" repeatCount=\"indefinite\" begin=\"0\" keytimes=\"0;.25;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\"  />\n" +
        "  </path>\n" +
        "  <path transform=\"translate(2 0)\" d=\"M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12\"> \n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"2 0; 12 0; 12 0;\" dur=\"0.8s\" repeatCount=\"indefinite\" begin=\"0\" keytimes=\"0;.35;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\"  />\n" +
        "  </path>\n" +
        "  <path transform=\"translate(12 0)\" d=\"M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12\"> \n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"12 0; 22 0; 22 0;\" dur=\"0.8s\" repeatCount=\"indefinite\" begin=\"0\" keytimes=\"0;.45;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\"  />\n" +
        "  </path>\n" +
        "  <path transform=\"translate(24 0)\" d=\"M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12\"> \n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"22 0; 32 0; 32 0;\" dur=\"0.8s\" repeatCount=\"indefinite\" begin=\"0\" keytimes=\"0;.55;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\"  />\n" +
        "  </path>\n" +
        "</svg>\n",
    'cylon': "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">\n" +
        "  <path transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n" +
        "  </path>\n" +
        "  <path opacity=\"0.5\" transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0.1s\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n" +
        "  </path>\n" +
        "  <path opacity=\"0.25\" transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n" +
        "    <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0.2s\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n" +
        "  </path>\n" +
        "</svg>\n"
};


class Loading extends React.Component {

  static defaultProps = {
    color: '#fff',
    delay: 0,
    type: 'balls',
  };

  state = {
    delayed: this.props.delay > 0,
  };

  componentDidMount() {
    const { delay } = this.props;
    const { delayed } = this.state;

    if (delayed) {
      this.timeout = setTimeout(() => {
        this.setState({
          delayed: false,
        });
      }, delay);
    }
  }

  componentWillUnmount() {
    const { timeout } = this;

    if (timeout) {
      clearTimeout(timeout);
    }
  }

  render() {
    const {
      color, delay, type, height, width, ...restProps
    } = this.props;
    const selectedType = this.state.delayed ? 'blank' : type;
    const svg = svgSources[selectedType];
    const style = {
      fill: color,
      height,
      width,
    };

    return (
      <div
        style={style}
        dangerouslySetInnerHTML={{ __html: svg }}
        {...restProps}
      />
    );
  }
}

module.exports = Loading;