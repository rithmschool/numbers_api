import './Home.css';
import CategoryContainer from './Category/CategoryContainer';
import SandboxContainer from './Sandbox/SandboxContainer';
import Footer from './Footer';
import APIDocumentation from './Documentation/APIDocumentation';

/**
* Container for all website components
*
* Props: 
* - None
* State:
* - None
*
*  (Home) -> CategoryContainer
*         -> SandboxContainer
*         -> Footer
*         -> APIDocumentation
*/    

function Home() {

  return (
    <div className="body-container">
      <div className="inner-container">
        <header>
          <h1 
            className="logo"> Numbers <span id="second-word">API</span>
          </h1>
          <h3 id="tagline"> 
            An API for interesting facts about numbers facts
          </h3>
        </header>
        <CategoryContainer />
        <SandboxContainer/>
        <Footer/>
        <APIDocumentation/>
      </div>
    </div>
  )
}

export default Home;