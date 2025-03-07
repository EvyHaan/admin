import { createLogic } from "redux-logic";
import {
  includes,
} from 'lodash';
import moment from 'moment';
import { 
  DELETE_EVENT,
  DELETE_EVENT_SUCCESS,
  DELETE_EVENT_FAIL,
  REQUEST_EVENTS, 
  REQUEST_EVENTS_FAILED,
  ARCHIVE_EVENT_SUCCESS,
  ARCHIVE_EVENT,
  APPROVE_EVENT,
  APPROVE_EVENT_SUCCESS,
  APPROVE_EVENT_FAIL,
  REQUEST_OLD_EVENTS,
  UPDATE_EXISTING_EVENT,
  UPDATE_EVENT_SUCCESS,
  UPDATE_EVENT_FAIL,
} from "./constants";
import {
  addOldEventToState,
  setLoading,
  storeEventsInState,
} from "./actions";
import {
  requestResearcherById
} from "../researchers/actions";

const fetchEvents = createLogic({
  type: REQUEST_EVENTS,
  process(deps, dispatch, done) {
      const {
        action,
        firebasedb,
    } = deps;
    const { payload } = action;
    if (!payload) {
      return [];
    }
    return firebasedb.ref(`${payload}`).once('value')
      .then((snapshot) => {
        const allData = [];
        const allUids = [];
        snapshot.forEach((ele) => {
          const event = ele.val();
          const researcher = event.enteredBy;
          if (researcher && !includes(researcher, '@')) {
            if (!includes(allUids, researcher)) {
              dispatch(requestResearcherById(researcher))
            }
            allUids.push(researcher);
          }
          allData.push(ele.val())
        })
        dispatch(storeEventsInState(allData));
      })
      .then(done)
  }
});

const fetchOldEventsLogic = createLogic({
  type: REQUEST_OLD_EVENTS,
  processOptions: {
    failType: REQUEST_EVENTS_FAILED,
  },
  process({
      getState,
      action,
      firebasedb
    }, dispatch, done) {
    const {
      payload
    } = action;
    console.log('startAt', payload.dates[0], 'endtAt', payload.dates[1], `${payload.path}/${payload.date}`)
    const ref = firebasedb.ref(`${payload.path}/${payload.date}`);
    dispatch(setLoading(true))
    const allEvents = [];
    const allUids = [];
    ref.orderByChild('dateObj').startAt(payload.dates[0]).endAt(payload.dates[1]).on('child_added', (snapshot) => {
      const event = snapshot.val();
      const researcher = event.enteredBy;
      if (researcher && !includes(researcher, '@')) {
        if (!includes(allUids, researcher)) {
          dispatch(requestResearcherById(researcher))
        }
        allUids.push(researcher);
      }
      allEvents.push(event);
    })
    ref.once('value')
      .then(() => {
        dispatch(addOldEventToState(allEvents));
      })
      .then(() => {
        if (moment(payload.dates[1]).isSame(moment(payload.date, 'YYYY-MM'), 'month')) {
          dispatch(setLoading(false))
        }
        done()
      })
  }
});

const approveEventLogic = createLogic({
  type: APPROVE_EVENT,
  processOptions: {
    successType: APPROVE_EVENT_SUCCESS,
    failType: APPROVE_EVENT_FAIL,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;

    const {
      townHall,
      path,
      livePath,
    } = action.payload;
    console.log(livePath)
    const townHallMetaData = firebasedb.ref(`/townHallIds/${townHall.eventId}`);
    return firebasedb.ref(`${livePath}/${townHall.eventId}`).update(townHall)
      .then(() => {
        const approvedTownHall = firebasedb.ref(`${path}/${townHall.eventId}`);
        return approvedTownHall.remove()
          .then(() => {
            return townHallMetaData.update({
              status: 'live',
            })
            .then(() => {
              return townHall.eventId;
            })
          })
      })
  }
});

const archiveEventLogic = createLogic({
  type: ARCHIVE_EVENT,
  processOptions: {
    successType: ARCHIVE_EVENT_SUCCESS,
  },
  process(deps) {
      const {
        action,
        firebasedb,
      } = deps;

      const {
        townHall,
        path,
        archivePath
      } = action.payload;
      const oldTownHall = firebasedb.ref(`${path}/${townHall.eventId}`);
      const oldTownHallID = firebasedb.ref(`/townHallIds/${townHall.eventId}`);
      const dateKey = townHall.dateObj ? moment(townHall.dateObj).format('YYYY-MM') : 'no_date';
      console.log(`${archivePath}/${dateKey}/${townHall.eventId}`)
      return firebasedb.ref(`${archivePath}/${dateKey}/${townHall.eventId}`).update(townHall)
        .then(() => {
            const removed = oldTownHall.remove();
            if (removed) {
              return oldTownHallID.update({
                status: 'archived',
                archive_path: `${archivePath}/${dateKey}`,
              })
              .then(() => {
                return townHall.eventId;
              })
            }
        })
        .catch(e => {
          console.log(e)
        })
      }
})

const deleteEvent = createLogic({
  type: DELETE_EVENT,
  processOptions: {
    successType: DELETE_EVENT_SUCCESS,
    failType: DELETE_EVENT_FAIL,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    const { townHall, path } = action.payload;
    console.log(path, townHall.eventId)
    const oldTownHall = firebasedb.ref(`${path}/${townHall.eventId}`);
    if (path === 'townHalls') {
      firebasedb.ref(`/townHallIds/${townHall.eventId}`).update({
        eventId: townHall.eventId,
        lastUpdated: (Date.now()),
        status: 'cancelled',
      })
    }
    return oldTownHall.remove()
      .then(() => townHall.eventId);
  }
})

const updateEventLogic = createLogic({
  type: UPDATE_EXISTING_EVENT,
  processOptions: {
    successType: UPDATE_EVENT_SUCCESS,
    failType: UPDATE_EVENT_FAIL,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    const { updateData, path, eventId } = action.payload;
    if(!path || !eventId) {
      return
    }
    return firebasedb.ref(`${path}/${eventId}`).update(updateData).then(() => {
      return {...updateData, eventId}
    })
  }
})

export default [
  archiveEventLogic,
  approveEventLogic,
  fetchOldEventsLogic,
  fetchEvents,
  deleteEvent,
  updateEventLogic,
];