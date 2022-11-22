const Validate = require("./Validate");
const { makeBridge } = require("./BridgeMaker");
const { generate } = require("./BridgeRandomNumberGenerator");
const{ MOVING, RETRY, RESULT, CONTROL } = require("./constants/Values");

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  #bridgeInformation;
  #stairs;
  #user;
  #currentUpsidePosition;
  #currentDownsidePosition;
  #count;

  constructor() {
    this.#bridgeInformation = [];
    this.#stairs = {};
    this.#user = [];
    this.#currentUpsidePosition = [];
    this.#currentDownsidePosition = [];
    this.#count = 1;
  }

  ready(size) {
    const validate = new Validate();
    validate.validateBridgeSize(size);
    const bridgeInformation = makeBridge(Number(size), generate);
    this.#bridgeInformation = bridgeInformation;
    this.addBridgeCondition();
  }

  addBridgeCondition() {
    let bridgeSize = this.#bridgeInformation.length;
    this.#stairs.upside = new Array(bridgeSize + 1).fill(MOVING.PASS);
    this.#stairs.downside = new Array(bridgeSize + 1).fill(MOVING.PASS);
    for(let index = 0; index < bridgeSize; index++) {
      if(this.#bridgeInformation[index] === MOVING.UPSIDE_STRING) this.#stairs.downside.splice(index, 1, MOVING.UNPASSED);
      if(this.#bridgeInformation[index] === MOVING.DOWNSIDE_STRING) this.#stairs.upside.splice(index, 1, MOVING.UNPASSED);
    }
  }

  /**
   * 사용자가 칸을 이동할 때 사용하는 메서드
   * <p>
   * 이동을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  move(moving) {
    let step = this.#user.length;
    if(moving === MOVING.UPSIDE_STRING) this.#stairs.downside.splice(step, 1, MOVING.BLANK);
    if(moving === MOVING.DOWNSIDE_STRING) this.#stairs.upside.splice(step, 1, MOVING.BLANK);
    this.#currentUpsidePosition = this.#stairs.upside.slice(0, step + 1);
    this.#currentDownsidePosition = this.#stairs.downside.slice(0, step + 1);
    this.getup();
    this.getdown();
    this.#user.push(moving);
  }

  getscore(){
    if(this.#currentUpsidePosition.indexOf(MOVING.UNPASSED) > -1 || this.#currentDownsidePosition.indexOf(MOVING.UNPASSED) > -1) return CONTROL.GAME_OVER;
    if(this.#user.length !== this.#bridgeInformation.length) return CONTROL.PASS_STEP;
    if(this.#user.length === this.#bridgeInformation.length) {
      this.getRecordSteps();
      this.getSucessValue();
      return CONTROL.GAME_END;
    }
  }

  getCountReplyNumber() {
    return this.#count
  }

  getSucessValue() {
    let lastStep = this.getRecordSteps();
    if(this.#currentUpsidePosition.length !== this.#bridgeInformation.length) return RESULT.FAIL;
    if(lastStep[0].indexOf(MOVING.UNPASSED) > -1 || lastStep[1].indexOf(MOVING.UNPASSED) > -1) return RESULT.FAIL;
    if(this.#currentUpsidePosition.length === this.#bridgeInformation.length) return RESULT.SUCCESS;
  }

  getup() {
    return this.#currentUpsidePosition.join(MOVING.JUMP);
  }

  getdown() {
    return this.#currentDownsidePosition.join(MOVING.JUMP);
  }

  getRecordSteps() {
    let recordAllSteps = [];
    recordAllSteps.push(this.#currentUpsidePosition.join(MOVING.JUMP),this.#currentDownsidePosition.join(MOVING.JUMP));
    return recordAllSteps;
  }

  /**
   * 사용자가 게임을 다시 시도할 때 사용하는 메서드
   * <p>
   * 재시작을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  retry(command) {
    const validate = new Validate();
    validate.validateCommand(command);
    if(command === RETRY.REPLAY) {
      this.#count += 1;
      this.initialize();
      return CONTROL.PASS_STEP;
    }
    if(command === RETRY.END) return CONTROL.GAME_END;
  }

  initialize() {
    this.#currentUpsidePosition = []
    this.#user = [];
    this.#currentDownsidePosition = []
    this.addBridgeCondition();
  }
}

module.exports = BridgeGame;