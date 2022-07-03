/*
 *
 */
export namespace EventUtil {
  /**
   * handleEvents 의 스웨거 예제입니다.
   */
  export const handleEventsExamples = {
    ADD: {
      value: {
        type: 'REVIEW',
        action: 'ADD',
        reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
        content: '좋습니다.!',
        attachedPhotoIds: [
          'c1029296-1ce0-49bf-9fac-6476820181fb',
          'dd77cefc-7ddc-4cf5-a61c-5a09b4e01fb9',
          'fa87bb80-39d2-4da6-857e-f89d2ab0efb9',
        ],
        userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
        placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
      },
    },
    MOD: {
      value: {
        type: 'REVIEW',
        action: 'MOD',
        reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
        content: '좋습니다.!',
        attachedPhotoIds: [
          'c1029296-1ce0-49bf-9fac-6476820181fb',
          'dd77cefc-7ddc-4cf5-a61c-5a09b4e01fb9',
        ],
        userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
        placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
      },
    },
    DELETE: {
      value: {
        type: 'REVIEW',
        action: 'DELETE',
        reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
        content: '',
        attachedPhotoIds: [],
        userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
        placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
      },
    },
  };
}
