<template>
  <div>
    <el-row :gutter="20">
      <!-- 左边部分，占页面的70% -->
      <el-col :span="17" class="left-section">
        <el-row :gutter="20">
          <el-col
            v-for="(servo, index) in servos"
            :key="index"
            :span="5"
            class="servo-col"
            :class="{ selected: servo.selected }"
          >
            <div class="grid-content ep-bg-purple-dark">
              <el-checkbox v-model="servo.selected">选择</el-checkbox>
              <el-switch
                v-model="servo.selectedSwitch"
                class="mb-2"
                active-text="丝滑"
                inactive-text="极速"
              />
              <el-input v-model="servo.channel" disabled>
                <template #prepend>舵机号：</template>
              </el-input>
              <el-input v-model="servo.old_angle" placeholder="0-180">
                <template #prepend>初始值：</template>
              </el-input>
              <el-input v-model="servo.new_angle" placeholder="0-180">
                <template #prepend>目标值：</template>
              </el-input>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7" class="right-section">
        <h1 align="center">动作组</h1>
        <el-form-item label="间距时间">
        <el-input v-model="delay" placeholder="时间（秒）" > </el-input>
        </el-form-item>
        <el-form-item label="动作名称">
          <el-input v-model="action_name" placeholder="只允许英语名称" clearable
            ><template #append>
              <el-button @click="saveActionName" text="True">Enter</el-button>
            </template>
          </el-input>
          <!-- <template #prepend>动作名称：</template> -->
        </el-form-item>

        <el-row class="row-bg" justify="center">
          <el-button type="primary" @click="saveActions">保存动作组</el-button>
          <el-button type="danger" @click="undoLastAction"
            >撤回上一步</el-button
          >
        </el-row>
        <div>
          <h2>保存的指令</h2>
          <ul>
            <li v-for="(instruction, index) in instructions" :key="index">
              <pre>{{ instruction }}</pre>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
const delay = ref<number>(0);
const action_name = ref<string>("");
// 创建包含16个舵机状态的数组
const servos = reactive(
  Array.from({ length: 16 }, (_, index) => ({
    channel: index,
    old_angle: 90,
    new_angle: 90,
    response: null as string | null,
    selected: false,
    selectedSwitch: false,
  }))
);

const instructions = ref<string[]>([]);
const actionStack = ref<string[]>([]); // 用于记录操作的堆栈

const saveActions = () => {
  servos.forEach((servo) => {
    if (servo.selected) {
      const mode = servo.selectedSwitch ? "丝滑" : "极速";
      let action: string | undefined;
      if (mode === "极速") {
        action = `pwm1.setServoAngleP1(${servo.channel}, ${servo.new_angle})`;
      } else if (mode === "丝滑") {
        const old_angle = servo.old_angle;
        const new_angle = servo.new_angle;
        if (new_angle < old_angle) {
          action = `for i in range(${old_angle}, ${new_angle}, -1):\n    pwm1.setServoAngleP1(${servo.channel}, i)\n    await asyncio.sleep(${delay.value})`;
        } else {
          action = `for i in range(${old_angle}, ${new_angle}, 1):\n    pwm1.setServoAngleP1(${servo.channel}, i)\n    await asyncio.sleep(${delay.value})`;
        }
      }

      if (action) {
        instructions.value.push(action);
        actionStack.value.push(action); // 记录操作
      }
    }
  });
};

const saveActionName = () => {
  const name = `def ${action_name.value}:\n`;
  instructions.value.push(name);
};

const undoLastAction = () => {
  if (actionStack.value.length > 0) {
    actionStack.value.pop(); // 从堆栈中移除最近的操作
    instructions.value.pop(); // 从指令列表中移除相应的操作
  }
};
</script>

<script lang="ts"></script>
<style scoped>
.selected {
  background-color: rgb(147, 197, 244) !important; /* 确保样式优先 */
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.left-section {
  padding-right: 20px;
  background-color: #f9f9f9;
}

.right-section {
  padding-left: 20px;
  background-color: #f0f0f0;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.servo-col {
  margin-bottom: 20px;
}
.grid-content {
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-input {
  margin-bottom: 10px;
}
.el-button {
  margin-top: 10px;
}
.button-col {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
