import Vue from 'vue'
import Vuex from 'vuex'
import local from '../data'
import {ipcRenderer} from 'electron'
import * as lib from '../lib'
import * as bridge from "../bridge"


Vue.use(Vuex)

const state = {
    cmds: [],
    activeCmd: null
}

const mutations = {
    addCmd: (state, data) => {
        state.cmds.push(new lib.Command(data));
    },
    editCmd: (state, data) => {
        var cmds = state.cmds;
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == data.id) {
                Object.assign(cmds[i], data);
                break;
            }
        }
    },
    deleteCmd: (state, id) => {
        var cmds = state.cmds;
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                cmds.splice(i, 1);
                break;
            }
        }
        if(state.activeCmd.id == id) {
            state.activeCmd = null;
        }
        
    },
    addLog: ({cmds}, {id, msg}) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == id) {
                lib.Command.pushLog(cmds[i], msg);
            }
        }
    },
    clearLogs: (state) => {
        state.activeCmd.logs = [];
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
    editCmd: ({commit, dispatch}, data) => {
        commit('editCmd', data);
        dispatch('update2disk');
    },
    deleteCmd: ({commit, dispatch, state}, id) => {
        bridge.trigger("exec_end", state.activeCmd);
        commit("deleteCmd", id);
        commit('refreshActiveCmd');
        dispatch('update2disk');
    },
    getDataFromDisk: ({commit}) => {
        local.get('cmds', function (data) {
            commit("clearCmds")
            data = data || [];
            for(let i = 0; i < data.length; i++) 
                commit('addCmd', data[i]);
            
                
        
            commit('refreshActiveCmd');
        });   
    },
    startActiveCmd: ({commit, state}) => {
        if(state.activeCmd.isRunning) return;
        
        commit("setCmdStart", state.activeCmd.id);
        bridge.trigger("exec", state.activeCmd);
        
    },
    stopActiveCmd: ({commit, state}) => {
        if(!state.activeCmd.isRunning) return;
        bridge.trigger("exec_end", state.activeCmd);
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

bridge.on('exec_data', ({msg, id}) => {
    store.commit("addLog", {
       id,
       msg
   });
});

bridge.on('exec_terminated', ({id}) => {
    store.commit("setCmdStop", id);
    store.commit("addLog", {
       id,
       msg: "\n--------------------\n-------end----------\n--------------------\n"
   });
});

export default store
