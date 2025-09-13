import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import GlbWatcher from '@/components/GlbWatcher'
import { useGlbVersion } from '@/lib/glb-version-store'

const Cube = () => {
  const path = './cube.glb'
  const version = useGlbVersion(path)
  const { scene } = useGLTF(version ? `${path}?v=${version}` : path)

  return <primitive object={scene} />
}

const Plane = () => {
  const path = './plane.glb'
  const version = useGlbVersion(path)
  const { scene } = useGLTF(version ? `${path}?v=${version}` : path)

  return <primitive object={scene} />
}

const Scene = () => (
  <>
    <OrbitControls>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} />
    </OrbitControls>
    <Suspense fallback={null}>
      <Cube />
    </Suspense>
    <Suspense fallback={null}>
      <Plane />
    </Suspense>
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
