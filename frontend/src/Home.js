import './Home.css';

import CategoryContainer from './Category/CategoryContainer';
import SandboxContainer from './Sandbox/SandboxContainer';
import SocialIcons from './SocialIcons';
import APIDocumentation from './Documentation/APIDocumentation';
import Footer from './Footer';

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
*         -> SocialIcons
*         -> APIDocumentation
*         -> Footer
*/    

function Home() {
  return (
    <div className="wrapper">
      <div className="inner-container">
        <header>
          <div 
            className="logo"> Numbers <span id="second-word">API</span>
          </div>
          <h3 id="tagline"> 
            An API for interesting facts about numbers facts
          </h3>
        </header>
        <CategoryContainer />
        <SandboxContainer/>
        <SocialIcons/>
        <APIDocumentation/>
        <Footer />
      </div>
    </div>
  )
}

export default Home;