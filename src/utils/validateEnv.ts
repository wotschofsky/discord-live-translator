const requiredValues = ['BOT_TOKEN'];

const validateEnv = () => {
  let failed = false;
  requiredValues.forEach((value) => {
    if (!process.env[value]) {
      console.error(`${value} not set in env!`);
      failed = true;
    }
  });

  if (failed) {
    process.exit();
  }
};

export default validateEnv;
