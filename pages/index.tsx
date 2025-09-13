import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

const IndexPage = () => (
  <Canvas>
    <OrbitControls />
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
    <directionalLight position={[4, 4, 4]} intensity={1} />
    <directionalLight position={[4, 4, -4]} intensity={1} />
    <ambientLight intensity={1} />
  </Canvas>
)

export default IndexPage
