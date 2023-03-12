import * as CANNON from 'cannon-es'

export default class PhysicsUtils {
    static meshToBody(mesh, mass, returnBody = false) {
        let position = mesh.position
        let geometry = mesh.geometry.parameters
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: new CANNON.Box(new CANNON.Vec3(geometry.width / 2, geometry.height/ 2,  geometry.depth/ 2 )),
            quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
        })
        if (returnBody) {
            return body
        }
    }
}