<template>
  <div class="container">
    <div class="robot">
      <div class="head"></div>
      <div class="arms">
        <div
          v-for="arm in arms.slice(0, 4)"
          :key="arm.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="arm.id"
            v-model="arm.checked"
            @change="updateMessage(arm.id)"
          />
          <label :for="arm.id" class="arm">{{ arm.name }}</label>
        </div>
      </div>
      <div class="arms">
        <div
          v-for="arm in arms.slice(4, 6)"
          :key="arm.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="arm.id"
            v-model="arm.checked"
            @change="updateMessage(arm.id)"
          />
          <label :for="arm.id" class="arm">{{ arm.name }}</label>
        </div>
      </div>
      <div class="arms">
        <div v-for="hand in hands" :key="hand.id" class="checkbox-wrapper">
          <input
            type="checkbox"
            :id="hand.id"
            v-model="hand.checked"
            @change="updateMessage(hand.id)"
          />
          <label :for="hand.id" class="arm">{{ hand.name }}</label>
        </div>
      </div>
      <div class="checkbox-wrapper">
        <input
          type="checkbox"
          id="hip"
          v-model="hip.checked"
          @change="updateMessage(hip.id)"
        />
        <label for="hip" class="arm">hip</label>
      </div>
      <div class="legs">
        <div
          v-for="leg in legs.slice(0, 2)"
          :key="leg.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="leg.id"
            v-model="leg.checked"
            @change="updateMessage(leg.id)"
          />
          <label :for="leg.id" class="arm">{{ leg.name }}</label>
        </div>
      </div>
      <div class="legs">
        <div
          v-for="leg in legs.slice(2, 4)"
          :key="leg.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="leg.id"
            v-model="leg.checked"
            @change="updateMessage(leg.id)"
          />
          <label :for="leg.id" class="arm">{{ leg.name }}</label>
        </div>
      </div>
      <div class="legs">
        <div
          v-for="leg in legs.slice(4, 6)"
          :key="leg.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="leg.id"
            v-model="leg.checked"
            @change="updateMessage(leg.id)"
          />
          <label :for="leg.id" class="arm">{{ leg.name }}</label>
        </div>
      </div>
      <div class="legs">
        <div
          v-for="leg in legs.slice(6, 8)"
          :key="leg.id"
          class="checkbox-wrapper"
        >
          <input
            type="checkbox"
            :id="leg.id"
            v-model="leg.checked"
            @change="updateMessage(leg.id)"
          />
          <label :for="leg.id" class="arm">{{ leg.name }}</label>
        </div>
      </div>
      <button @click="clearAll">Clear All</button>
    </div>
    <div class="servo-control">
      <div class="control" v-for="item in selectedItems" :key="item.id">
        <p>舵机号为：{{ item.id }}</p>
        <div class="input-group">
          <label :for="'start-angle-' + item.id">起始角度：</label>
          <input
            type="text"
            :id="'start-angle-' + item.id"
            v-model="item.startAngle"
            class="small-input"
          />
        </div>
        <div class="input-group">
          <label :for="'end-angle-' + item.id">终止角度：</label>
          <input
            type="text"
            :id="'end-angle-' + item.id"
            v-model="item.endAngle"
            class="small-input"
          />
        </div>
        <div class="input-group">
          <label :for="'delay-' + item.id">延迟时间：</label>
          <input
            type="text"
            :id="'delay-' + item.id"
            v-model="item.delay"
            class="small-input"
          />
        </div>
        <div class="input-group">
          <div>
            <input
              type="radio"
              :id="'mode1-' + item.id"
              value="mode1"
              v-model="item.mode"
            />
            <label :for="'mode1-' + item.id">极速</label>
          </div>
          <div>
            <input
              type="radio"
              :id="'mode2-' + item.id"
              value="mode2"
              v-model="item.mode"
            />
            <label :for="'mode2-' + item.id">丝滑</label>
          </div>
        </div>
      </div>
    </div>
    <div class="function">
      <h1>function</h1>
      <button @click="sendSelectedServoData">发送选中的数据</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import axios from "axios";
<<<<<<< HEAD
const raspi_ip = "192.168.123.209";
const sendSelectedServoData = async () => {
  try {
    const dataToSend = selectedItems.value.map((item) => ({
      id: item.id,
      startAngle: item.startAngle,
      endAngle: item.endAngle,
      delay: item.delay,
      mode: item.mode,
    }));
    const response = await axios.post(
      `http://${raspi_ip}:5000/servo`,
      dataToSend
    );
    console.log("Data sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
const message = ref("");
=======
const raspi_ip = "192.168.204.169";
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
    selectedSwitch: false,
    board1:false,
    board2:false,
  }))
);
const delay = ref(0); // 延迟时间

// 发送选中舵机命令
const sendSelectedServoCommands = async () => {
  try {
    const requests = servos
      .filter((servo) => servo.board1 || servo.board2)
      .map((servo) => {
        const mode = servo.selectedSwitch ? "丝滑" : "极速";
        const board = servo.board1 ? 'board1' : (servo.board2 ? 'board2' : null);
        if (mode === "极速") {
          return axios.post(`http://${raspi_ip}:5000/servo`, {
            action: "set",
            channel: servo.channel,
            angle: servo.angle,
            board: board,
          });
        } else if (mode === "丝滑") {
          return axios.post(`http://${raspi_ip}:5000/servo_smooth`, {
            channel: servo.channel,
            angle: servo.angle,
            delay: delay.value,
            board: board,
          });
        }
      });

    const responses = await Promise.all(requests);
    responses.forEach((res, index) => {
      if (res && res.data) {
        const selectedServo = servos.filter((servo) => servo.board1 || servo.board2)[index];
        selectedServo.response =
          res.data.status === "success" ? "设置成功" : res.data.error;
      }
    });
  } catch (error) {
    console.error("Error sending servo commands:", error);
  }
};
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

</script>
>>>>>>> 93e260322182e15017d84d7c857e990c5d4ee630

const arms = ref([
  {
    id: "arm1",
    name: "arm1",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "arm2",
    name: "arm2",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "arm3",
    name: "arm3",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "arm4",
    name: "arm4",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "arm5",
    name: "arm5",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "arm6",
    name: "arm6",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
]);

const hands = ref([
  {
    id: "hand1",
    name: "hand1",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "hand2",
    name: "hand2",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
]);

const legs = ref([
  {
    id: "leg1",
    name: "leg1",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg2",
    name: "leg2",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg3",
    name: "leg3",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg4",
    name: "leg4",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg5",
    name: "leg5",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg6",
    name: "leg6",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg7",
    name: "leg7",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
  {
    id: "leg8",
    name: "leg8",
    checked: false,
    startAngle: "",
    endAngle: "",
    delay: "0",
    mode: "mode1",
  },
]);

const hip = ref({
  id: "hip",
  name: "hip",
  checked: false,
  startAngle: "",
  endAngle: "",
  delay: "0",
  mode: "mode1",
});

const selectedItems = computed(() => {
  return [...arms.value, ...hands.value, ...legs.value, hip.value].filter(
    (item) => item.checked
  );
});

const updateMessage = (id: string) => {
  const item = [...arms.value, ...hands.value, ...legs.value, hip.value].find(
    (item) => item.id === id
  );
  if (item) {
    message.value = item.id;
  }
};

const clearAll = () => {
  arms.value.forEach((arm) => {
    arm.checked = false;
    arm.startAngle = "";
    arm.endAngle = "";
  });
  hands.value.forEach((hand) => {
    hand.checked = false;
    hand.startAngle = "";
    hand.endAngle = "";
  });
  legs.value.forEach((leg) => {
    leg.checked = false;
    leg.startAngle = "";
    leg.endAngle = "";
  });
  hip.value.checked = false;
  hip.value.startAngle = "";
  hip.value.endAngle = "";
  message.value = "";
};
</script>

<style scoped>
.checkbox-wrapper {
  position: relative;
  display: inline-block;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  display: inline-block;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: rgb(246, 255, 246);
  border: 1px solid #000;
  cursor: pointer;
}

input[type="checkbox"]:checked + label {
  background-color: rgb(200, 200, 255); /* Change color when checked */
}

.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  margin-right: 1px; /* Reduce the margin between label and input */
}

.control {
  display: flex;
  flex-direction: column;
  width: 60%; /* Adjust width to make the control frame smaller */
  margin: 0 auto;
  padding: 10px; /* Reduce padding to make the control frame smaller */
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left; /* Ensure text is left-aligned */
}

label {
  width: 100px; /* Adjust width to align labels */
  text-align: left; /* Ensure labels are left-aligned */
}

input.small-input {
  width: 60px; /* Adjust width to make input boxes smaller */
}

.container {
  display: flex;
  width: 100vw; /* Full viewport width */
}

.robot {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  width: 30vw; /* 30% of the viewport width */
  margin-left: 10px; /* 10px margin from the left side */
}

.servo-control {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  width: 20vw; /* Reduce to 60% of the viewport width */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  /* border: 1px solid #ccc; */
}
.function {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  width: 40vw; /* Reduce to 60% of the viewport width */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

.head {
  width: 80px;
  height: 80px;
  background-color: rgb(246, 255, 246);
  border: 1px solid #000;
}

.arms {
  display: flex;
  justify-content: space-between;
  width: 400px;
}

.servo {
  width: 100px;
  height: 40px;
  background-color: rgb(246, 255, 246);
  border: 1px solid #000;
}

.legs {
  display: flex;
  justify-content: space-between;
  width: 200px;
}
</style>
