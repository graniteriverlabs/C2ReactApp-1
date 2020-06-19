import React, { Component } from "react"
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { mouseBusy, resizeSplitterPaneToNormalMode } from '../../utils';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { PC_RESET_BTN, PC_GETCAP_BTN, PC_DUT_DISBALE_MODE, FP_CABLE_SELECTION, COMPLIANCE_CABLE_SELECTION } from '../../Constants/tooltip';
import { ClipLoader } from 'react-spinners';
import { observer } from "mobx-react";
import { convertCapsJsonFormat } from '../../modals/JsonConverter';
import { chartstore } from "../../modals/ChartStoreModal";
import { observe } from "mobx";

let getCapsStatusDescription = '';
// let splittedCableName = ''
const PortConfigComponent = observer(
    class PortConfigComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {
                dutType: mainstore.productCapabilityProps.ports[this.props.portnumber].getDutType(),
                cableType: mainstore.productCapabilityProps.ports[this.props.portnumber].getCableType(),
                selectedPort: mainstore.productCapabilityProps.ports[this.props.portnumber].getPortLableType(),
                loading: false,
            };

            // const disposer = observe(mainstore, "reRenderCableSelectionDropDown", (change) => {
            //     if(mainstore.connectionInfo.testerStatus === "Connected")

            // });
        }

        dutTypeDropDownChange = eventKey => {
            this.setState({ dutType: eventKey })
            //   console.log("MainStore",mainstore.productCapabilityProps.ports[this.props.portnumber],)
            mainstore.productCapabilityProps.ports[this.props.portnumber].setDutType(eventKey)

            mainstore.testConfiguration.testList = []
            /*while emptying the selected testcase,its not unchecking the selected one in test config panel,so empty the selected testcase and called gettestlist method */
            basemodal.getTestList();
        }

        cableTypedropDownChange(eventKey) {
            var splitCableName = eventKey.split("(")[0]
            // if (eventKey.includes("(")) {
            //     mainstore.productCapabilityProps.ports[this.props.portnumber].splittedCableName = eventKey.substring(eventKey.lastIndexOf('(') + 0)
            // }
            // else {
            //     splittedCableName = " "
            // }
            this.setState({ cableType: splitCableName })
            mainstore.cableSelectionFromDropDownInInformational = true;
            mainstore.loadSelectedCableFromBackend = false;
            mainstore.productCapabilityProps.ports[this.props.portnumber].setCableType(splitCableName)
        }

        portsDropDownOnChange(eventKey) {
            this.setState({ selectedPort: eventKey })
            mainstore.productCapabilityProps.ports[this.props.portnumber].setPortLableType(eventKey)
            basemodal.putVIFData(Constants.PORTA, mainstore.copyVifInfo)
        }

        getCapabilities() {
            mainstore.renderGlassPaneWhileGetcaps = true
            mainstore.isGetCapsEnabled = true;
            mainstore.status.appState = Constants.BUSY
            mainstore.isGetDeviceCapsInProgress = true;//Mainstore is taking time for this variable's change to update
            basemodal.getCapabilities(this.props.portnumber, this.loadGetCapsData.bind(this));
            setTimeout(() => {
                this.setChartAndPollingState(true)
                chartstore.channelList = [];                //Clear channel list 
            }, 1000);
            mainstore.currentPanelIndex = 3;
            this.resettingToDefaults()
        }

        resettingToDefaults = () => {
            chartstore.showVerticalBar = false; //disable vertical marker in plot while app in busy state
            mainstore.showMarkerByDefault = false;  //disable background color for vertical marker
            resizeSplitterPaneToNormalMode();
            mainstore.renderDefaultMerge = true;
            mainstore.enableMergeByDefault = true;
        }

        loadGetCapsData(responseData) {
            setTimeout(() => {
                mainstore.currentPanelIndex = 1
                mainstore.renderGlassPaneWhileGetcaps = false;      //added timeout for showing the getcaps toast message
            }, 3500);

            var portIndex = (this.props.portnumber === Constants.PORTA) ? 1 : 2;
            mainstore.getCapsPortNumber = portIndex
            if (responseData) {
                let backendConvertedFormat = convertCapsJsonFormat(responseData);
                basemodal.vifDataModal.loadJson(backendConvertedFormat, Constants.TYPE_DEVICE, portIndex);
            }
            this.setChartAndPollingState(false)
        }

        setChartAndPollingState(enabled) {
            this.setAppState(enabled)
            mainstore.isGetDeviceCapsInProgress = enabled;
            mainstore.chartPollEnabled = enabled;
            if (enabled)//This will be set to false from backend once getcaps process is completed
                mainstore.panelResultPolling = enabled;
        }

        setAppState(isBusy) {
            this.setState({ loading: isBusy });
            getCapsStatusDescription = ''
            mouseBusy(isBusy)
        }

        clearDeviceData(data) {
            mainstore.isGetCapsEnabled = false;
            basemodal.vifDataModal.clearGetCapsData()
        }

        setgetCapsStatusDescrpition = () => {
            if (mainstore.popUpInputs.spinnerID === 3)
                getCapsStatusDescription = mainstore.popUpInputs.spinnerDesc
        }

        render() {
            var secondaryPortAlign = "";
            var rerenderRequired = mainstore.productCapabilityProps.rerenderRandomNum
            var checkDUtTypeIsEnabled = mainstore.productCapabilityProps.vifFileName !== Constants.VIF_LOAD_BTN_DEFAULT
            var disbaleDutTypeField = " "
            if (checkDUtTypeIsEnabled) {
                disbaleDutTypeField = 'disable-dut-type-dropdown'
            }
            if (this.props.portnumber === "PortB") {
                secondaryPortAlign = "secondary-port-align"
            }
            this.setgetCapsStatusDescrpition()

            return (<>
                <FlexView column>
                    {(this.props.portnumber === Constants.PORTA) ? <p className="panelHeading">Port 1</p> : <p className="panelHeading">Port 2</p>}

                    {mainstore.numberofPorts === true ?
                        null :
                        <Dropdown className="dut-port-align">
                            <span className="label-text-padding primaryport-padding">{this.props.portnumber === Constants.PORTA ? "Primary Port" : "Secondary Port"}</span>
                            <Dropdown.Toggle className={"dropdowncustom " + secondaryPortAlign} variant="success" id="dropdown-basic" > {(this.state.selectedPort) ? (this.state.selectedPort) : ("Please Select Connected Port")}   </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    mainstore.portLabelArrayEntries.map((portLabelValue, index) => {
                                        return <Dropdown.Item key={index} eventKey={portLabelValue} onSelect={this.portsDropDownOnChange.bind(this)}  >{portLabelValue}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown >
                    }

                    {this.props.isInCompMode === false ?
                        <div>
                            <FlexView className="dut-TypeSelection" column >
                                {<Dropdown className="dut-port-align" >
                                    <span className="label-text-padding">DUT Type</span>
                                    {checkDUtTypeIsEnabled ?
                                        <OverlayTrigger placement="top" overlay={<Tooltip> {PC_DUT_DISBALE_MODE} </Tooltip>}>
                                            <div className="align-dut-type">
                                                <Dropdown.Toggle className={"dropdowncustom dut-Dropdown " + disbaleDutTypeField} variant="success" id={this.props.portnumber + "_DUT_TYPE "}>{mainstore.productCapabilityProps.ports[this.props.portnumber].dutType}</Dropdown.Toggle>    {/*Dropdown will disabled at that added a tooltip to indicate  */}
                                            </div>
                                        </OverlayTrigger>
                                        :
                                        <Dropdown.Toggle className={"dropdowncustom dut-Dropdown"} variant="success" id={this.props.portnumber + "_DUT_TYPE "}>{mainstore.productCapabilityProps.ports[this.props.portnumber].dutType}</Dropdown.Toggle>}         {/*Dropdown in normal state without any tooltip */}
                                    <Dropdown.Menu>
                                        {
                                            Constants.USBPDDeviceType.map((uutType, index) => {
                                                return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={uutType} onSelect={this.dutTypeDropDownChange}>{uutType}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >}
                            </FlexView >
                        </div> : null}
                    <Dropdown className="dut-port-align">
                        {mainstore.reRenderCableSelectionDropDown ? null : null}             {/*we're updating "CABLE_DATA_TYPES" constant value in getcablename api ,it's not re-rendering , so using this variable to update the render method*/}
                        <span className="label-text-padding">Cable Selection</span>
                        <Dropdown.Toggle disabled={!(mainstore.productCapabilityProps.ports[this.props.portnumber].cableType === Constants.CABLE_DATA_TYPES[0] || mainstore.productCapabilityProps.ports[this.props.portnumber].cableType === Constants.CABLE_DATA_TYPES[1]) && mainstore.productCapabilityProps.executionMode === "ComplianceMode"} className="dropdowncustom test-cableOptions-dropdown" variant="success" id={this.props.portnumber + "_CABLE_SELECTION"} >{mainstore.productCapabilityProps.ports[this.props.portnumber].cableType}</Dropdown.Toggle>
                        {(mainstore.productCapabilityProps.ports[this.props.portnumber].cableType === Constants.CABLE_DATA_TYPES[0] || mainstore.productCapabilityProps.ports[this.props.portnumber].cableType === Constants.CABLE_DATA_TYPES[1]) && mainstore.productCapabilityProps.executionMode === "ComplianceMode" ?
                            < Dropdown.Menu >
                                {
                                    Constants.COMPLIANCE_CABLE_TYPES.map((data, index) => {
                                        return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.cableTypedropDownChange.bind(this)}>{data}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>
                            : <Dropdown.Menu >
                                {
                                    Constants.CABLE_DATA_TYPES_FOR_UI_ONLY.map((data, index) => {
                                        return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.cableTypedropDownChange.bind(this)}>{data}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>}
                        {mainstore.productCapabilityProps.executionMode === "ComplianceMode" ?
                            <div className="product-caps-cable-selection-info-icon" >
                                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom"
                                    overlay={<Tooltip className="product-caps-cable-selection-tooltip-inner-content-align">{COMPLIANCE_CABLE_SELECTION}</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" />
                                </OverlayTrigger>
                            </div> :
                            <div className="product-caps-cable-selection-info-icon" >
                                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom"
                                    overlay={<Tooltip className="tooltip-inner-content-align">{FP_CABLE_SELECTION}</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" />
                                </OverlayTrigger>
                            </div>
                        }
                    </Dropdown >

                    {this.props.isInCompMode === false ?
                        <div>
                            <FlexView>
                                <OverlayTrigger placement="top" overlay={<Tooltip> {PC_GETCAP_BTN} </Tooltip>}>
                                    <Button className="grl-button-blue grl-getCapabilities-button" id={this.props.portnumber + "_getCaps_button"} onClick={this.getCapabilities.bind(this)}>Get Capabilities</Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip > {PC_RESET_BTN} </Tooltip>}>
                                    <Button className="grl-button grl-reset-button" id={this.props.portnumber + "_reset_button"} onClick={this.clearDeviceData.bind(this)} >Reset</Button>
                                </OverlayTrigger>
                                <div className="clip-Loader-Align">
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={25}
                                        color={'#123abc'}
                                        loading={this.state.loading}
                                    />
                                </div>
                            </FlexView>
                            <FlexView className="grl-getCapabilities-button">
                                <p className="firmware-spinner-status">{getCapsStatusDescription}</p>
                            </FlexView>
                        </div> : null}
                </FlexView>
            </>);
        }
    })

export default PortConfigComponent;