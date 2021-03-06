import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../ViewModel/BaseModal';
import { observer } from 'mobx-react';

const TBTConfig = observer((props) => {
  let tbtconfiginfo = mainstore.testConfiguration.tbtConfiguration;

  const noOfPortsDropDownOnChange = (eventKey) => {
    tbtconfiginfo.portType = eventKey;
  }
  const poweredTypeDropDownOnChange = (eventKey) => {
    tbtconfiginfo.poweredType = eventKey;
  }
  const deviceTypeDropDownOnChange = (eventKey) => {
    tbtconfiginfo.deviceType = eventKey;
    if (eventKey === Constants.TBTDutCategory[0])
      tbtconfiginfo.poweredType = Constants.PoweredType[0]
  }
  const stressTimingTextBoxOnChange = (event) => {
    tbtconfiginfo.stressTiming = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const OnisPortACapMisMatchChange = (event) => {
    tbtconfiginfo.isPortACapMisMatchSet = event.target.checked;
  }
  const OnisPortBCapMisMatchChange = (event) => {
    tbtconfiginfo.isPortBCapMisMatchSet = event.target.checked;
  }
  const OnisPortAGiveBackChange = (event) => {
    tbtconfiginfo.isPortAGiveBackSet = event.target.checked;
  }
  const OnisPortBGiveBackChange = (event) => {
    tbtconfiginfo.isPortBGiveBackSet = event.target.checked;
  }
  const tbtVersionTypeDropDownOnChange = (eventKey) => {
    tbtconfiginfo.tbT_Version = eventKey;
  }

  return (
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>Thunderbolt Power Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel"> Number Of Ports</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcTBTNumberOfPortsComboBox">{tbtconfiginfo.portType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.NoOfPorts.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={noOfPortsDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            <tr>
              <td className="panellabel">Powered Type</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle disabled={tbtconfiginfo.deviceType === Constants.TBTDutCategory[0]} className="dropdowncustom" variant="success" id="tcTBTPoweredTypeComboBox">{tbtconfiginfo.poweredType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.PoweredType.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={poweredTypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            <tr>
              <td className="panellabel">Device Type</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcTBTDeviceTypeComboBox">{tbtconfiginfo.deviceType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.TBTDutCategory.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={deviceTypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            <tr>
              <td className="panellabel">TBT Version</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcTBTDeviceTypeComboBox">{tbtconfiginfo.tbT_Version}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.TBTDutVersion.map((tbtVersion, index) => {
                        return <Dropdown.Item key={index} eventKey={tbtVersion} onSelect={tbtVersionTypeDropDownOnChange}>{tbtVersion}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            <tr>
              <td className="panellabel">Stress Test Timer</td>
              <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={tbtconfiginfo.stressTiming} id="tcTBTStressTestTimerInputField" onChange={stressTimingTextBoxOnChange} placeholder="" /></td>
              <td className="alignlabel">(secs)</td>
            </tr>

            <tr>
              <td></td>
              <td>
                <FlexView column>
                  <label className="checkbox-label-width">
                    <input type="checkbox" className="checkbox-align-custom" id="tcTBTPortACapMisMatchCheckBox" onChange={OnisPortACapMisMatchChange} checked={tbtconfiginfo.isPortACapMisMatchSet} type='checkbox' /> Port-A CapMisMatch
                  </label>
                  <label className="checkbox-label-width">
                    <input type="checkbox" disabled={tbtconfiginfo.portType === Constants.NoOfPorts[0]} className="checkbox-align-custom" id="tcTBTPortBCapMisMatchCheckBox" onChange={OnisPortBCapMisMatchChange} checked={tbtconfiginfo.isPortBCapMisMatchSet} type='checkbox' /> Port-B CapMisMatch
                  </label>
                  <label className="checkbox-label-width">
                    <input type="checkbox" className="checkbox-align-custom" id="tcTBTPortAGiveBackFlagCheckBox" onChange={OnisPortAGiveBackChange} checked={tbtconfiginfo.isPortAGiveBackSet} type='checkbox' />Port-A GiveBackFlag
                  </label>
                  <label className="checkbox-label-width">
                    <input type="checkbox" disabled={tbtconfiginfo.portType === Constants.NoOfPorts[0]} className="checkbox-align-custom" id="tcTBTPortBGiveBackFlagCheckBox" onChange={OnisPortBGiveBackChange} checked={tbtconfiginfo.isPortBGiveBackSet} type='checkbox' />Port-B GiveBackFlag
                  </label>
                </FlexView>
              </td>
            </tr>
          </tbody>
        </Table>
      </FlexView>
    </FlexView>
  )
}
)

export default TBTConfig;