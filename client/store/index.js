import Vue from 'vue'
import Vuex from 'vuex'
import local from '../../node/data'
import {ipcRenderer} from 'electron'

Vue.use(Vuex)

const state = {
    cmds: [],
    activeCmd: null
}

const mutations = {
    addCmd: (state, data) => {
        state.cmds.push(data);
    },
    addLog: ({cmds}, {cmd, msg}) => {
        for(let i = 0; i < cmds.length; i++) {
            if(cmds[i].id == cmd.id) {
                cmd.logs.push(msg);
            }
        }
    },
    update: ({cmds}) => {
        local.set('cmds', cmds);
    },
    setCmds: (state, data) => {
        state.cmds = data;
        for(let i = 0;i < state.cmds.length; i++)
            state.cmds[i].logs ? "" : state.cmds[i].logs = [];
    },
    setActiveCmd: (state, cmd) => {
        state.activeCmd = cmd;
    },
    refreshActiveCmd: (state) => {
        if(state.cmds.length > 0 && !state.activeCmd)
            state.activeCmd = state.cmds[0];
    }
    
}

const actions = {
    addCmd: ({commit}, data) => {
        var tmp = Object.assign({
            id: 'cmd' + (+new Date()),
            logs: []
        }, data);
        
        commit('addCmd', tmp);
        commit('refreshActiveCmd');
        commit('update');
    },
    update: ({commit}) => {
        local.get('cmds', function (data) {
            commit("setCmds", data);
            commit('refreshActiveCmd');
        });   
    },
    changeActiveCmd: ({commit}, cmd) => {
        commit("setActiveCmd", cmd);
    },
    startActiveCmd: ({commit, state}) => {
        if(state.activeCmd.isRunning) return;
        
        var id = +new Date();
    
        ipcRenderer.send('exec', id, state.activeCmd);
        
    },
    stopActiveCmd: ({commit, state}) => {
        if(!state.activeCmd.isRunning) return;
        //todo
    },
    addLog: ({commit}, {cmd, msg}) => {
        
    },
    doCmdStop: ({commit}, {cmd}) => {
        
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

ipcRenderer.on('callback_exec', function (event, {msg, cmd, isRunning}) {
    if(msg)
        store.dispatch('addLog', {
            cmd,
            msg
        });
    
    if(!isRunning)
        store.dispatch('doCmdStop', {
            cmd
        })
});

export default store
