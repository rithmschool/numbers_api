import './SocialIcons.css'
const numShares = 15;

/**
* Render icons for sharing the website
*
* Props: 
* - None
* State:
* - None
*
* Home -> (SocialIcons)
*/

function SocialIcons() {
  
  return (
    <div id="visitors">
      <div className="gradient-fill"></div>
      <div id="addthis">
        <div className="addthis_toolbox addthis_32x32_style">
          <a href="www.twitter.com" className="icon addthis_button_preferred_1"> </a>
          <a href="www.linkedin.com" className="icon addthis_button_preferred_2"> </a>
          <a href="www.email.com" className="icon addthis_button_preferred_3"> </a>
          <a href="www.pinterest.com" className="icon addthis_button_preferred_4"> </a>
          <a href="www.share.com" className="icon addthis_button_compact"> </a>
          <a href="www.count.com" className="icon addthis_counter addthis_bubble_style"> </a>
        </div>
      </div>
      <div className="visit-text">
        This page has been shared more times than the outgoing port for email message submission.
      </div>
      <div className="gradient-fill"></div>
    </div>
  )
}

export default SocialIcons;