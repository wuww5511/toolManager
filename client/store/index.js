import Vue from 'vue'
import Vuex from 'vuex'
import local from '../../node/data'
import {ipcRenderer} from 'electron'
import * as lib from '../lib'


Vue.use(Vuex)

const state = {
    cmds: [],
    activeCmd: null
}

const mutations = {
    addCmd: (state, data) => {
        state.cmds.push(new lib.Command(data));
    },
    deleteCmd: ({cmds}, id) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                cmds.splice(i, 1);
                break;
            }
        }
    },
    addLog: ({cmds}, {id, msg}) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                lib.Command.pushLog(cmds[i], msg);
            }
        }
    },
    clearCmds: (state) => {
        state.cmds = [];
    },
    setActiveCmd: (state, cmd) => {
        state.activeCmd = cmd;
    },
    setCmdStop: ({cmds}, id) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                cmds[i].isRunning = false;
            }
        }
    },
    setCmdStart: ({cmds}, id) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                cmds[i].isRunning = true;
            }
        }
    },
    refreshActiveCmd: (state) => {
        if(state.cmds.length > 0 && !state.activeCmd)
            state.activeCmd = state.cmds[0];
        if(state.cmds.length == 0)
            state.activeCmd = null;
    }
    
}

const actions = {
    update2disk: ({state}) => {
        var res = [];
        
        for(let i = 0; i < state.cmds.length; i++)
            res.push(lib.Command.getData(state.cmds[i]));
        
        local.set('cmds', res);
    },
    addCmd: ({commit, dispatch}, data) => {
        commit('addCmd', data);
        commit('refreshActiveCmd');
        dispatch('update2disk');
    },
    deleteCmd: ({commit, dispatch}, id) => {
        commit("deleteCmd", id);
        commit('refreshActiveCmd');
        dispatch('update2disk');
    },
    getDataFromDisk: ({commit}) => {
        local.get('cmds', function (data) {
            commit("clearCmds")
            
            for(let i = 0; i < data.length; i++) 
                commit('addCmd', data[i]);
            
                
        
            commit('refreshActiveCmd');
        });   
    },
    startActiveCmd: ({commit, state}) => {
        if(state.activeCmd.isRunning) return;
        
        var id = +new Date();
        commit("setCmdStart", state.activeCmd.id);
        ipcRenderer.send('exec', id, state.activeCmd);
        
    },
    stopActiveCmd: ({commit, state}) => {
        if(!state.activeCmd.isRunning) return;
        ipcRenderer.send('exec_end', +new Date(), state.activeCmd);
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

ipcRenderer.on('callback_exec_data', function (event, {msg, id}) {
   store.commit("addLog", {
       id,
       msg
   })
});

ipcRenderer.on('callback_exec_end', function (event, {id}) {
   store.commit("setCmdStop", id);
});

export default store
