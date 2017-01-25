<style>
    .nav{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        padding-top: 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
    .container{
        width: 90%;
        margin-left: auto;
        margin-right: auto;
    }
    .body{
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .operation{
        position: absolute;
        left: 0;
        width: 200px;
        height: 100%;
        border-right: 1px solid #ccc;
    }
    .info{
        position: absolute;
        left: 200px;
        right: 0;
        height: 100%;
        overflow: auto;
        padding: 10px;
        box-sizing: border-box;
    }
    .cmdDlg .el-row + .el-row{
        margin-top: 10px;
    }
    .oitem{
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
    }
    .oitem.active,
    .oitem:hover{
        background: #eee;
    }
    .oitem.active{
        cursor: default;
    }
</style>
<template>
 <div>
    <nav class="nav">
       <div class="container">
            <el-button :disabled="!$store.state.activeCmd" v-if="$store.state.activeCmd && $store.state.activeCmd.isRunning" @click="onStopBtnClick">停止</el-button>
            <el-button :disabled="!$store.state.activeCmd" v-else @click="onStartBtnClick">启动</el-button>
            <el-button :disabled="!$store.state.activeCmd" @click="onEditBtnClick">编辑</el-button>
            <el-button :disabled="!$store.state.activeCmd" @click="onClearLogs">清空日志</el-button>
            <el-button :disabled="!$store.state.activeCmd" @click="onDeleteBtnClick">删除</el-button>
            <el-button @click="onAddBtnClick">新增</el-button>
       </div>
        
    </nav>
    <div class="body">
        <div class="operation">
            <div :class="{oitem: true, active: cmd.id == $store.state.activeCmd.id}" v-for="cmd in $store.state.cmds" @click="onOperationClick(cmd)">{{cmd.name}}</div>
        </div>
        <div class="info" ref="info">
           <template v-if="$store.state.activeCmd">
               <div v-for="log in $store.state.activeCmd.logs">{{log}}</div>
           </template>
            
        </div>
    </div>
    <CmdDlg :data="adlg" v-model="showAdlg" @add="onAddCmd" @edit="onEditCmd" />
    
 </div>
</template>

<script>
import CmdDlg from "../components/CmdDlg"

export default {
    data () {
        return {
            nav: {
                isRunning: false
            },
            adlg: {
                name: '',
                cmd: '',
                path: '',
                id: ''
            },
            showAdlg: false
        };
    },
    components: {
        CmdDlg
    },
    created: function () {
        this.$store.dispatch('getDataFromDisk');
    },
    watch: {
        "$store.state.activeCmd.logs": function () {
            
            this.$nextTick(() => {
                var container = this.$refs.info;
                container.scrollTop = container.scrollHeight;
            });
        }
    },
    methods: {
        onDlgSave: function () {
            if(this.adlg.id)
                this.doAddCmd();
            else
                this.doEditCmd();
        },
        onAddBtnClick: function () {
            this.showAdlg = true;
            this.adlg = Object.assign({}, {
                id: '',
                name: '',
                path: '',
                cmd: ''
            })
        },
        onEditBtnClick: function () {
            this.showAdlg = true;
            var activeCmd = this.$store.state.activeCmd;
            this.adlg = Object.assign({}, {
                id: activeCmd.id,
                name: activeCmd.name,
                path: activeCmd.path,
                cmd: activeCmd.cmd
            })
        },
        onDeleteBtnClick: function () {
            this.$store.dispatch('deleteCmd', this.$store.state.activeCmd.id);
            this.$message("删除成功");
        },
        onClearLogs: function () {
            this.$store.commit("clearLogs");
            this.$message("清除成功");
        },
        onOperationClick: function (cmd) {
            this.$store.commit("setActiveCmd", cmd);
        },
        onStopBtnClick: function () {
            this.$store.dispatch('stopActiveCmd');
        },
        onStartBtnClick: function () {
            this.$store.dispatch('startActiveCmd');
        },
        onAddCmd: function (data) {
            this.$store.dispatch('addCmd', data);
            this.$message("保存成功");
            this.showAdlg = false;
        },
        onEditCmd: function (data) {
            this.$store.dispatch('editCmd', data);
            this.$message("保存成功");
            this.showAdlg = false;
        }
    }
}
</script>

