import React from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { PANELS } from '../../Constants';

class LeftNavBar extends React.Component {
handleToggleChange = (val) => {
    this.props.setCurrentPanelIndex( val.target.value );
}

  handleToggleGroupValueChange = (event) => {
    this.props.setCurrentPanelIndex(event);
  }

  render() {
    var navItems = PANELS.map((element, index) => {
      var imgname = "images/leftNavIcons/" + element.name + ".png";//TODO Move to SVG icons once we get them from the UX developer
      return <ToggleButton className="leftbarButtonGroup" key={index} name={index + "-"} value={index} onChange={this.handleToggleChange} >
            <FlexView column hAlignContent='center' vAlignContent='center' height='100%' className="custom-setIcon">
          <img src={imgname} alt={element.title} className="leftnavbar-img"/>
                <span className="leftnavbar-title">{element.title}</span>                          
            </FlexView>
          </ToggleButton>;
    });
    return (
        <FlexView column width={140}  hAlignContent='center' vAlignContent='top' className="leftnavbar-container leftnav-height-browser-resize">
        <ToggleButtonGroup id="left-toggle-group" type="radio" className="leftbarButtonGroup" name="tbgleft" value={this.props.currentPanelIndex} onChange={this.handleToggleGroupValueChange}>
          {navItems}
        </ToggleButtonGroup>
        </FlexView> );
  }

}


export default LeftNavBar;
