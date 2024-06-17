<template>
  <div>
    <el-row :gutter="20">
      <!-- 左边部分，占页面的70% -->
      <el-col :span="17" class="left-section">
        <el-row :gutter="20">
          <el-col
            v-for="(servo, index) in servos"
            :key="index"
            :span="4"
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
              <el-input v-model="servo.angle" placeholder="0-180">
                <template #prepend>角度值：</template>
              </el-input>
              <div v-if="servo.response">{{ servo.response }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row> </el-row>
      </el-col>
      <el-col :span="7" class="right-section">
        <h1 align="center">舵机调试功能</h1>
        <el-form-item label="间距时间">
          <el-input v-model="delay" placeholder="时间（秒）"> </el-input>
        </el-form-item>
        <el-button type="primary" @click="checkAllServosValue">
          查询所有舵机当前值
        </el-button>
        <el-button type="primary" @click="sendSelectedServoCommands">
          发送选中指令
        </el-button>
        <el-row>
          <el-button type="primary" @click="setActionGroup"
            >编写动作组</el-button
          >
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import axios from "axios";
const raspi_ip = "192.168.123.209";
const router = useRouter();

// 添加动作组
const setActionGroup = () => {
  // 重定向到动作组页面
  router.push("/action");
};

// 创建包含16个舵机状态的数组
const servos = reactive(
  Array.from({ length: 16 }, (_, index) => ({
    channel: index,
    angle: 90,
    response: null as string | null,
    selected: false,
    selectedSwitch: false,
  }))
);
const delay = ref(0); // 延迟时间

// 查询所有舵机的当前值
const batchRequest = async (batchSize: number) => {
  for (let i = 0; i < servos.length; i += batchSize) {
    const batch = servos.slice(i, i + batchSize);
    const requests = batch.map((servo) =>
      axios.post(`http://${raspi_ip}:5000/servo`, {
        action: "get",
        channel: servo.channel,
      })
    );
    const responses = await Promise.all(requests);
    responses.forEach((res, index) => {
      const current_angle = res.data.current_angle || res.data.error;
      servos[i + index].response = current_angle
        ? `舵机角度为：${current_angle}`
        : res.data.error;
    });
    await new Promise((resolve) => setTimeout(resolve, 10)); // 延迟 10ms
  }
};

// 调用批处理请求函数
const checkAllServosValue = () => {
  batchRequest(4); // 每次发送 4 个请求
};

// 发送选中舵机命令
const sendSelectedServoCommands = async () => {
  try {
    const requests = servos
      .filter((servo) => servo.selected)
      .map((servo) => {
        const mode = servo.selectedSwitch ? "丝滑" : "极速";
        if (mode === "极速") {
          return axios.post(`http://${raspi_ip}:5000/servo`, {
            action: "set",
            channel: servo.channel,
            angle: servo.angle,
          });
        } else if (mode === "丝滑") {
          return axios.post(`http://${raspi_ip}:5000/servo_smooth`, {
            channel: servo.channel,
            angle: servo.angle,
            delay: delay.value,
          });
        }
      });

    const responses = await Promise.all(requests);
    responses.forEach((res, index) => {
      if (res && res.data) {
        const selectedServo = servos.filter((servo) => servo.selected)[index];
        selectedServo.response =
          res.data.status === "success" ? "设置成功" : res.data.error;
      }
    });
  } catch (error) {
    console.error("Error sending servo commands:", error);
  }
};
</script>

<script lang="ts">
export default {
  name: "ServoControl",
};
</script>

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
