const OutputView = require("./OutputView");
const InputView = require("./InputView");
const BridgeGame = require("./BridgeGame");

class App {

  constructor() {
    this.brideGame = new BridgeGame();
  }

  play() {
    OutputView.printStart();
    this.requestBridgeSize();
  }

  requestBridgeSize() {
    InputView.readBridgeSize(this.tryBuildBridge.bind(this));
  }

  requestMoving() {
    InputView.readMoving(this.tryBuildMoving.bind(this));
  }

  requestCommand() {
    InputView.readGameCommand(this.tryBuildRetry.bind(this))
  }

  tryBuildBridge(size) {
    try {
      this.brideGame.ready(size);
      this.requestMoving();
    } catch(error) {
      this.retryRequestBridgeSize();
    }
  }

  tryBuildMoving(moving) {
    try {
      this.brideGame.move(moving);
    } catch(error) {
      this.retryRequestMoving();
    }
  }

  tryBuildRetry(command) {
    try{
      let controlKey = this.brideGame.retry(command);
      this.decideControl(controlKey);
    } catch(error) {
      this.retryRequestCommand();
    }
  }

  decideControl(controlKey) {

  }

  retryRequestBridgeSize() {
    OutputView.printValidateSizeError();
    this.requestBridgeSize();
  }
 
  retryRequestMoving() {
    OutputView.printValidateStringError();
    this.requestMoving();
  }

  retryRequestCommand() {
    OutputView.printValidateStringCommandError();
    this.requestCommand();
  }
}

const app = new App();
app.play();

module.exports = App;
