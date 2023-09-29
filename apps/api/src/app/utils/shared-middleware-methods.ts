import { BadRequestException } from '@nestjs/common';

export function checkEmptyInputs(...args: string[]): void {
  for (const arg of args) {
    if ( typeof arg !== "number" && !arg) {
      throw new BadRequestException('Please complete all mandatory inputs!');
    }
  }
}
