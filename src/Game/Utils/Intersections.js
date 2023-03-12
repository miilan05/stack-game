export default class Intersections {
    static intersects(cube1, cube2, error = 0.1) {
        let cube1Pos =  cube1.position
        let cube2Pos =  cube2.position
        let cube1Geo =  cube1.geometry.parameters
        let cube2Geo =  cube2.geometry.parameters
    
        if (Math.abs(cube1Pos.x - cube2Pos.x) < error && Math.abs(cube1Pos.z - cube2Pos.z ) < error) {
            //  cube1Pos.x = cube2Pos.x
            //  cube1Pos.z = cube2Pos.z
            //  world.addBody(meshToBody(m.at(-1), 0, true))
            //  perfectEffect(cube1Pos)
             let insidePiece = {
                left: cube2Pos.x - cube2Geo.width / 2 ,
                right: cube2Pos.x - cube2Geo.width / 2 + cube2Geo.width, 
                bottom: cube2Pos.z - cube2Geo.height / 2,
                top: cube2Pos.z - cube2Geo.height / 2 + cube2Geo.height
            }
             return {insidePiece: insidePiece, outsidePiece: undefined}
        }

        let rect1 = {
            left: cube2Pos.x - cube2Geo.width / 2 ,
            right: cube2Pos.x - cube2Geo.width / 2 + cube2Geo.width, 
            bottom: cube2Pos.z - cube2Geo.height / 2,
            top: cube2Pos.z - cube2Geo.height / 2 + cube2Geo.height
        }
    
        let rect2 = {
            left: cube1Pos.x - cube1Geo.width / 2 ,
            bottom: cube1Pos.z - cube1Geo.height / 2,
            right: cube1Pos.x - cube1Geo.width / 2 + cube1Geo.width, 
            top: cube1Pos.z - cube1Geo.height / 2 + cube1Geo.height
        }
    
        let insidePiece = {
            left: Math.max(rect1.left, rect2.left),
            bottom: Math.max(rect1.bottom, rect2.bottom),
            right: Math.min(rect1.right, rect2.right),
            top: Math.min(rect1.top, rect2.top)
        }
    
        let outsidePiece = {
            left: rect2.left,
            right: rect2.right,
            bottom: rect2.bottom,
            top: rect2.top
        }
    
        if (insidePiece.left === rect2.left && rect2.left && insidePiece.right === rect2.right) {
            if (insidePiece.bottom === rect2.bottom) {
                outsidePiece.bottom = insidePiece.top
            }
            else {
                outsidePiece.top = insidePiece.bottom
            }
        }
        else {
            if (insidePiece.left === rect2.left) {
                outsidePiece.left = insidePiece.right
            }
            else {
                outsidePiece.right = insidePiece.left
            }
        }
        if ((insidePiece.left > insidePiece.right || insidePiece.bottom > insidePiece.top)) {
            return undefined
        }
        else {
            return {insidePiece: insidePiece, outsidePiece: outsidePiece}
        }
    }
}