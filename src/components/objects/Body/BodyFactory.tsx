import { Component } from "react";
import * as Matter from "matter-js";
// import { IBodyDefinition, IChamferableBodyDefinition } from "matter-js";

interface IBodyFactoryProps {
  engine?: any;
  angle?: number;
  flagInternal?: boolean;
  removeCollinear?: number;
  minimumArea?: number;
  x?: number;
  y?: number;
  radius?: number;
  width?: number;
  height?: number;
  shape?: string;
  slope?: number;
  sides?: number;
  vector?: any;
  options?: any;
}

export default class BodyFactory extends Component<IBodyFactoryProps> {
  public static defaultProps = { options: {} };
  public body: any;
  // @ts-ignore
  constructor(props: any) {
    super(props);
    const {
      engine,
      x,
      y,
      radius,
      width,
      height,
      shape,
      slope,
      sides,
      angle,
      vector,
      options,
      flagInternal,
      removeCollinear,
      minimumArea
    } = props;

    this.body = (() => {
      switch (shape) {
        case "circle":
          return Matter.Bodies[shape](x, y, radius, options);
        case "trapezoid":
          return Matter.Bodies[shape](x, y, width, height, slope, options);
        case "polygon":
          return Matter.Bodies[shape](x, y, sides, radius, options);
        case "fromVertices":
          return Matter.Bodies[shape](
            x,
            y,
            vector,
            options,
            flagInternal,
            removeCollinear,
            minimumArea
          );
        case "rectangle":
          return Matter.Bodies[shape](x, y, width, height, options);
      }
      return null;
    })();
    if (angle) {
      Matter.Body.setAngle(this.body, angle);
    }
    Matter.World.addBody(engine.world, this.body);
  }
  public componentDidUpdate(prevProps: IBodyFactoryProps) {
    const { options } = this.props;

    Object.keys(options).forEach(option => {
      if (option in this.body && prevProps[option] !== this.props[option]) {
        Matter.Body.set(this.body, option, options[option]);
      }
    });
  }

  public componentWillUnmount() {
    // @ts-ignore
    Matter.World.remove(this.props.engine.world, this.body);
  }

  public render() {
    return null;
  }
}
