export default class Intersections {
    static createRectangle = (position, geometry) => {
        const left = position.x - geometry.width / 2;
        const bottom = position.z - geometry.height / 2;
        const right = left + geometry.width;
        const top = bottom + geometry.height;
      
        return { left, bottom, right, top };
      };
      
      // Function to check if two cubes intersect
      static intersects = (cube1, cube2, error = 0.1) => {
        const { position: cube1Pos, geometry: { parameters: cube1Geo } } = cube1;
        const { position: cube2Pos, geometry: { parameters: cube2Geo } } = cube2;
      
        if (Math.abs(cube1Pos.x - cube2Pos.x) < error && Math.abs(cube1Pos.z - cube2Pos.z) < error) {
          const insidePiece = this.createRectangle(cube2Pos, cube2Geo);
          return { insidePiece, outsidePiece: undefined };
        }
      
        const rect1 = this.createRectangle(cube2Pos, cube2Geo);
        const rect2 = this.createRectangle(cube1Pos, cube1Geo);
      
        const insidePiece = {
          left: Math.max(rect1.left, rect2.left),
          bottom: Math.max(rect1.bottom, rect2.bottom),
          right: Math.min(rect1.right, rect2.right),
          top: Math.min(rect1.top, rect2.top),
        };
      
        const outsidePiece = { ...rect2 };
      
        if (insidePiece.left === rect2.left && insidePiece.right === rect2.right) {
          if (insidePiece.bottom === rect2.bottom) {
            outsidePiece.bottom = insidePiece.top;
          } else {
            outsidePiece.top = insidePiece.bottom;
          }
        } else {
          if (insidePiece.left === rect2.left) {
            outsidePiece.left = insidePiece.right;
          } else {
            outsidePiece.right = insidePiece.left;
          }
        }
      
        if (insidePiece.left > insidePiece.right || insidePiece.bottom > insidePiece.top) {
          return undefined;
        } else {
          return { insidePiece, outsidePiece };
        }
      };
}