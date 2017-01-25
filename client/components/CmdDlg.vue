<template>
    <el-dialog :title=" !data.id? '添加命令': '编辑命令'" v-model="isShow" custom-class="cmdDlg">
        <input type="hidden" v-model="id">
        <el-row>
            <el-input placeholder="请输入名称" v-model="name"></el-input>
        </el-row>
        <el-row>
            <el-input placeholder="请输入命令" v-model="cmd"></el-input>
        </el-row>
        <el-row>
            <el-input placeholder="请输入执行路径" v-model="path"></el-input>
        </el-row>
        <el-row>
            <el-button v-if="!id" @click="onSave">添加命令</el-button>
            <el-button v-else @click="onSave">保存命令</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
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
                        name: this.name
                    })
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