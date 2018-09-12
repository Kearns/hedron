import * as React from "react";
import BodyFactory from "./BodyFactory";
import Game from "../../../Game";

export interface IShape {
  x: number;
  y: number;
  angle?: number;
  options?: object;
  shape?: string;
}

export interface IRectangle extends IShape {
  width: number;
  height: number;
}

export interface ICircle extends IShape {
  radius: number;
  angle?: number;
}

export interface IPolygon extends IShape {
  radius: number;
  sides: number;
}

export interface ITrapezoid extends IShape {
  width: number;
  height: number;
  slope: number;
}

export interface IVertices extends IShape {
  vector: object;
  flagInternal?: boolean;
  removeCollinear?: number;
  minimumArea?: number;
}

const Body = (
  props: IRectangle | ICircle | IPolygon | ITrapezoid | IVertices
) => (
  <Game.Context.Consumer>
    {(context: object) => <BodyFactory {...props} {...context} />}
  </Game.Context.Consumer>
);

export const Rectangle = (props: IRectangle) => (
  <Body {...props} shape="rectangle" />
);

export const Circle = (props: ICircle) => <Body {...props} shape="circle" />;

export const Polygon = (props: IPolygon) => <Body {...props} shape="polygon" />;

export const Trapezoid = (props: ITrapezoid) => (
  <Body {...props} shape="trapezoid" />
);

export const Vertices = (props: IVertices) => (
  <Body {...props} shape="fromVertices" />
);

export default Body;
