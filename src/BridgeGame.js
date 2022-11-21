const Validate = require("./Validate");
const { makeBridge } = require("./BridgeMaker");
const { generate } = require("./BridgeRandomNumberGenerator");
const { MOVING, RETRY, RESULT, CONTROL } =  require("./constants/Values");
const{ Console } = require("@woowacourse/mission-utils"); //테스트용 추가, 완료 후 삭제

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  #bridgeInformation;

  constructor() {
    this.#bridgeInformation = [];
  }

  ready(size) {
    const validate = new Validate();
    validate.validateBridgeSize(size);
    const bridgeInformation = makeBridge(Number(size), generate);
    this.#bridgeInformation = bridgeInformation;
    Console.print(this.#bridgeInformation) //테스트용 추가, 완료 후 삭제
    
  }
  /**
   * 사용자가 칸을 이동할 때 사용하는 메서드
   * <p>
   * 이동을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  move(moving) {
    const validate = new Validate();
    validate.validateMove(moving);
  }

  /**
   * 사용자가 게임을 다시 시도할 때 사용하는 메서드
   * <p>
   * 재시작을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  retry() {}
}

module.exports = BridgeGame;
