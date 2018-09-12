import * as React from "react";
import { ReactNode } from "react";
import WorldComponent from "./components/World";

// @ts-ignore
import Matter, {
  Engine,
  Events,
  Render,
  Mouse,
  MouseConstraint
} from "matter-js";

interface IGameProps {
  children?: ReactNode;
  bounds?: {
    min: { x: number; y: number; scale: number };
    max: { x: number; y: number; scale: number };
  };
  gravity?: { x: number; y: number; scale: number };
  onCollision?(args: any[]): any;
  onInit?(args: any[]): any;
  onUpdate?(args: any[]): any;
}

export default class Game extends React.Component<IGameProps> {
  // @ts-ignore
  public static Context = React.createContext();

  public static defaultProps = {
    gravity: {
      x: 0,
      y: 0.1,
      scale: 0.01
    },
    // detect collisions only in these bounds
    bounds: {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight }
    },

    onCollision: () => null,
    onInit: () => null,
    onUpdate: () => null
  };
  // @ts-ignore
  public mainLoop;
  public lastTime: number | null;
  public state = {};

  public Engine = Engine.create({
    world: Matter.World.create({
      // @ts-ignore
      bounds: this.props.bounds,
      // @ts-ignore
      gravity: this.props.gravity
    })
  });

  public loop = () => {
    this.mainLoop = window.requestAnimationFrame(this.loop);
    const currTime = 0.001 * Date.now();
    Engine.update(
      this.Engine,
      1000 / 60,
      this.lastTime ? currTime / this.lastTime : 1
    );
    this.lastTime = currTime;
    this.forceUpdate();
  };

  public componentDidMount() {
    this.lastTime = null;
    // @ts-ignore
    this.props.onInit(this.Engine);
    // @ts-ignore
    Events.on(this.Engine, "afterUpdate", this.props.onUpdate);
    // @ts-ignore
    Events.on(this.Engine, "collisionStart", this.props.onCollision);
    // create renderer

    this.loop();

    const render = Render.create({
      element: document.body,
      engine: this.Engine
    });

    Engine.run(this.Engine);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    // @ts-ignore
    const mouseConstraint = MouseConstraint.create(this.Engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Matter.World.add(this.Engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    // @ts-ignore
    Render.mouse = mouse;

    Render.run(render);
  }

  public componentWillUnmount() {
    // @ts-ignore
    Events.off(this.Engine, "afterUpdate", this.props.onUpdate);
    // @ts-ignore
    Events.off(this.Engine, "collisionStart", this.props.onCollision);
    window.cancelAnimationFrame(this.mainLoop);
  }

  public render() {
    const defaultStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100px",
      width: "100px"
    };
    // const { children } = this.props;
    return (
      // @ts-ignore
      <div style={defaultStyles}>
        <Game.Context.Provider
          value={{
            state: this.state,
            engine: this.Engine,
            update: (value: any) => this.setState(value),

            categories: {}
          }}
        >
          <WorldComponent />
        </Game.Context.Provider>
      </div>
    );
  }
}
