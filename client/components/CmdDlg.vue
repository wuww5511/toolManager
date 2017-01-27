<template>
    <el-dialog :title=" !data.id? '添加命令': '编辑命令'" v-model="isShow" custom-class="cmdDlg">
        <input type="hidden" v-model="id">
        <el-row>
            <el-input placeholder="请输入名称" min="1" v-model="name"></el-input>
        </el-row>
        <el-row>
            <el-input placeholder="请输入命令" v-model="cmd" min="1"></el-input>
        </el-row>
        <el-row>
           <div class="el-input">
           <input type="text" placeholder="请输入执行路径" class="el-input__inner" v-model="path" @click="onPathClick" readonly />
           </div>
           
        </el-row>
        <el-row>
            <el-button v-if="!id" @click="onSave">添加命令</el-button>
            <el-button v-else @click="onSave">保存命令</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
    import * as bridge from "../bridge"

    export default {
        data () {
            return {
                isShow: false,
                id: '',
                cmd: '',
                path: '',
                name: ''
            }
        },
        props: ['data', 'value'],
        methods: {
            onSave: function () {
                var type = "add";
                
                if(this.id) type = 'edit';
                
                this.$emit(type, {
                        id: this.id,
                        cmd: this.cmd,
                        path: this.path,
                        name: this.name || `name_${+new Date()}`
                    })
            },
            onPathClick: function () {
                bridge.trigger("select_path", {
                    properties: ["openDirectory"]
                }, (paths) => {
                    if(paths) {
                        this.path = paths[0];
                    }
                });
            }
        },
        computed: {
            show: function () {
                return this.isShow;
            }
        },
        watch: {
            value: function (val) {
                this.isShow = val;
            },
            isShow: function (val) {
                this.$emit('input', val);
            },
            data: function (val) {
                Object.assign(this, {
                    id: val.id,
                    name: val.name,
                    path: val.path,
                    cmd: val.cmd
                });
            }
        }
    }
</script>