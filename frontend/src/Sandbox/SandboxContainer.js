import SandboxCard from './SandboxCard'
import RandomCard from './RandomCard'
import TryItOutArrow from './TryItOutArrow'
import './SandboxContainer.css'

/**
* Container for all sandbox components
*
* Props: 
* - None
* State:
* - None
*
*  (SandboxContainer) -> TryItOutArrow
*                     -> SandboxCard
*                     -> RandomCard
*/    

function SandboxContainer() {
  return (
    <section id="sandbox-outer"> 
      <div id="sandbox">
        <TryItOutArrow />
        <SandboxCard/>
        <RandomCard/>
      </div>
    </section>
  )
}

export default SandboxContainer;