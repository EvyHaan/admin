import React from 'react';
import {
  Card,
  Checkbox,
  Button,
  Tag,
  Input,
  Row,
  Icon,
} from 'antd';

import MeetingTypeSelect from './MeetingTypeSelect.js';
import IconFlagSelect from './IconFlagSelect.js';
import './style.scss';

const {
  Meta,
} = Card;

const { 
    TextArea 
} = Input;


export default class EventCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentEditing: false,
        }
        this.setEditMeetingTypeTrue = this.setEditMeetingTypeTrue.bind(this)
        this.selectMeetingType = this.selectMeetingType.bind(this)
        this.setEditIconFlagTrue = this.setEditIconFlagTrue.bind(this)
        this.selectIconFlag = this.selectIconFlag.bind(this)
        this.setEditEventNotesTrue = this.setEditEventNotesTrue.bind(this)
        this.selectEventNotes = this.selectEventNotes.bind(this)
        this.stopEditing = this.stopEditing.bind(this)
        this.toggleAdaAccessible = this.toggleAdaAccessible.bind(this)
    }

    renderPendingActions() {
        const {
            archiveEvent,
            approveEvent,
            deleteEvent,
            canApprove
        } = this.props;
        const buttonList = [
                    <Button key="archive-button" ghost type="primary" icon="export" onClick={archiveEvent}>Archive</Button>, 
                    <Button key="delete-button" type="danger" icon="delete" onClick={deleteEvent}>Delete</Button>,
                ]
        if (canApprove) {
            buttonList.push(
                    <Button key="approve-button" type="primary" icon="check" onClick={approveEvent}>Approve</Button>
            )
        }
        return buttonList;
    }

    renderLiveActions() {
        const {
            archiveEvent,
            deleteEvent,
        } = this.props;
        return [
                    <Button key="archive-button"ghost type="primary" icon="export" onClick={archiveEvent}>Archive</Button>, 
                    <Button key="delete-button" type="danger" icon="delete" onClick={deleteEvent}>Delete</Button>]
    }

    setEditMeetingTypeTrue() {
        this.setState({currentEditing: 'meetingType'})
    }

    selectMeetingType(value) {
        const {
            updateEvent,
        } = this.props
        updateEvent({meetingType: value})
        this.setState({currentEditing: false})
    }

    setEditIconFlagTrue() {
        this.setState({currentEditing: 'iconFlag'})
    }

    selectIconFlag(value) {
        const {
            updateEvent,
        } = this.props
        updateEvent({iconFlag: value})
        this.setState({currentEditing: false})
    }

    setEditEventNotesTrue() {
        this.setState({currentEditing: 'eventNotes'})
    }

    selectEventNotes({target}) {
        const {
            updateEvent,
        } = this.props
        updateEvent({Notes: target.value.trim()})
        this.setState({currentEditing: false})
    }

    stopEditing() {
        this.setState({currentEditing: false})
    }

    toggleAdaAccessible({target}) {
        const {
            updateEvent,
        } = this.props
        updateEvent({ada_accessible: target.checked})
    }

    render() {
        const {
          townHall,
          pending,
        } = this.props;
        const displayMeetingType = (<React.Fragment><span>{townHall.meetingType}</span><Icon type="edit" onClick={this.setEditMeetingTypeTrue} /></React.Fragment>)
        const displayIconFlag = (<React.Fragment><span>{townHall.iconFlag}</span><Icon type="edit" onClick={this.setEditIconFlagTrue} /></React.Fragment>)
        const displayEditNotes = (<React.Fragment><span>{townHall.Notes}</span><Icon type="edit" onClick={this.setEditEventNotesTrue} /></React.Fragment>)
        
        const selectMeetingType = (
            <Row type="flex" justify="start">
                <MeetingTypeSelect meetingType={townHall.meetingType} selectMeetingType={this.selectMeetingType}/>
                <Button icon="close" shape="circle" onClick={this.stopEditing}/>
            </Row>
        )
        const selectIconFlag = (
            <Row type="flex" justify="start">
                <IconFlagSelect iconFlag={townHall.iconFlag} onSelect={this.selectIconFlag}/>
                <Button icon="close" shape="circle"onClick={this.stopEditing}/>
            </Row>
            )
        const selectEventNotes = (
            <Row type="flex" justify="start">
                <Button icon="close" shape="circle" onClick={this.stopEditing}/>
                <TextArea onPressEnter={this.selectEventNotes} defaultValue={townHall.Notes}/>
            </Row>
            )
        
        return (
            <Card 
                key={townHall.eventId}
                className="event-card"
                extra={(<Button icon="edit">Edit (coming soon)</Button>)}
                actions={pending ? this.renderPendingActions() : this.renderLiveActions()}
                title={`${townHall.displayName || townHall.Member} (${townHall.party}) ${townHall.state} ${townHall.district || ''}`}
            >
                <Meta
                    title={townHall.eventName || ''}
                    description={this.state.currentEditing === 'meetingType' ? selectMeetingType : displayMeetingType}
                />
                <p>Notes: {this.state.currentEditing === 'eventNotes' ? selectEventNotes : displayEditNotes}</p>
                <p>{townHall.repeatingEvent ? `${townHall.repeatingEvent}` : `${townHall.dateString} at ${townHall.Time} ${townHall.timeZone}`}</p>
                <p>{townHall.Location || ''}</p>
                <p>{townHall.address}</p>
                <Checkbox defaultChecked={townHall.ada_accessible} onChange={this.toggleAdaAccessible}>ADA Accessible</Checkbox>
                <ul><h4>Meta data (not shown)</h4>
                    <li>Event id: {townHall.eventId}</li>
                    <li>Chamber: {townHall.chamber}</li>
                    <li>Icon Flag: {this.state.currentEditing === 'iconFlag' ? selectIconFlag : displayIconFlag}</li>
                    <li>Entered by: {townHall.enteredBy}</li>
                    <Tag color={townHall.dateValid ? "#2db7f5" : "#f50" }>{townHall.dateValid ? 'Date Valid' : 'Date not valid' }</Tag>
                    <Tag color={townHall.lat ?  "#2db7f5" : "#f50"}>{townHall.lat ? 'has geocode' : 'needs geocode'}</Tag>
                </ul>
               
      </Card>)
    }

}
