<style scoped>
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
        width: 140px;
        height: 100%;
        border-right: 1px solid #ccc;
    }
    .info{
        position: absolute;
        left: 140px;
        right: 0;
        height: 100%
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
            <el-button :disabled="!$store.state.activeCmd">编辑</el-button>
            <el-button :disabled="!$store.state.activeCmd">清空日志</el-button>
            <el-button :disabled="!$store.state.activeCmd" @click="onDeleteBtnClick">删除</el-button>
            <el-button @click="onAddBtnClick">新增</el-button>
            
            
       </div>
        
    </nav>
    <div class="body">
        <div class="operation">
            <div :class="{oitem: true, active: cmd.id == $store.state.activeCmd.id}" v-for="cmd in $store.state.cmds" @click="onOperationClick(cmd)">{{cmd.name}}</div>
        </div>
        <div class="info">
           <template v-if="$store.state.activeCmd">
               <div v-for="log in $store.state.activeCmd.logs">{{log}}</div>
           </template>
            
        </div>
    </div>
    <el-dialog title="添加命令" v-model="showAdlg" custom-class="cmdDlg">
        <el-row>
            <el-input placeholder="请输入名称" v-model="adlg.name"></el-input>
        </el-row>
        <el-row>
            <el-input placeholder="请输入命令" v-model="adlg.cmd"></el-input>
        </el-row>
        <el-row>
            <el-input placeholder="请输入执行路径" v-model="adlg.path"></el-input>
        </el-row>
        <el-row>
            <el-button @click="onAddCmd">添加命令</el-button>
        </el-row>
    </el-dialog>
 </div>
</template>

<script>
export default {
    data () {
        return {
            nav: {
                isRunning: false
            },
            adlg: {
                name: '',
                cmd: '',
                path: ''
            },
            showAdlg: false
        };
    },
    created: function () {
        this.$store.dispatch('getDataFromDisk');
    },
    methods: {
        onAddCmd: function () {
            this.$store.dispatch('addCmd', this.adlg);
            this.$message("添加成功");
            this.showAdlg = false;
        },
        onAddBtnClick: function () {
            this.showAdlg = true;
            for(var i in this.adlg)
                this.adlg[i] = '';
        },
        onDeleteBtnClick: function () {
            this.$store.dispatch('deleteCmd', this.$store.state.activeCmd.id);
            this.$message("删除成功");
        },
        onOperationClick: function (cmd) {
            this.$store.commit("setActiveCmd", cmd);
        },
        onStopBtnClick: function () {
            this.$store.dispatch('stopActiveCmd');
        },
        onStartBtnClick: function () {
            this.$store.dispatch('startActiveCmd');
        }
    }
}
</script>

