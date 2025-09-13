import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '../hooks/useGLTF'
import GlbWatcher from '@/components/GlbWatcher'

const Cube = () => {
  const { scene } = useGLTF('./cube.glb')
  console.log('🧊 Cube component rendered at:', new Date().toLocaleTimeString())

  return <primitive object={scene} />
}

const Plane = () => {
  const { scene } = useGLTF('./plane.glb')
  console.log('✈️ Plane component rendered at:', new Date().toLocaleTimeString())

  return <primitive object={scene} />
}

const Scene = () => (
  <>
    <OrbitControls>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} />
    </OrbitControls>
    <Cube />
    <Plane />
    <GlbWatcher />
    <directionalLight position={[4, 4, 4]} intensity={2} />
    <ambientLight intensity={1} />
  </>
)

const IndexPage = () => (
  <Canvas>
    <Scene />
  </Canvas>
)

export default IndexPage
