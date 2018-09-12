import * as React from "react";
import { Circle, Rectangle, Polygon } from "./objects/Body";

const World = (props: object) => (
  <React.Fragment>
    <Circle
      x={300}
      y={-250}
      radius={50}
      angle={10}
      options={{
        isStatic: false
      }}
    />

    <Rectangle
      x={300}
      y={0}
      width={100}
      height={100}
      angle={0}
      options={{
        isStatic: false
      }}
    />

    <Polygon
      x={300}
      y={450}
      sides={6}
      radius={120}
      angle={0.525}
      options={{
        isStatic: true
      }}
    />
  </React.Fragment>
);

export default World;
