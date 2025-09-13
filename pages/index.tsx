import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

const Cube = () => {
  const { scene } = useGLTF("./cube.glb")

  return <primitive object={scene} />
}

const Plane = () => {
  const { scene } = useGLTF("./plane.glb")
  return <primitive object={scene} />
}

const IndexPage = () => (
  <Canvas>
    <OrbitControls>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} />
    </OrbitControls>
    <Cube />
    <Plane />
    <directionalLight position={[4, 4, 4]} intensity={2} />
    <ambientLight intensity={1} />
  </Canvas>
)

export default IndexPage
