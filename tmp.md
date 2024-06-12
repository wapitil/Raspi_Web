// 发送选中舵机命令
const sendSelectedServoCommands = async () => {
  try {
    const requests = servos
    if 选择的是board1:
      .filter((servo) => servo.board1)
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

    elif 选择的是Board2:
    .filter((servo) => servo.board2)
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