const closedPayload = {
  data: {},
};

type payload = string | object | Buffer

abstract class Token {
  token: string;

  encrypt(): Promise<string>;

  decrypt(): Promise<payload>;
}

class OtherToken implements Token {
  public token: string;

  public async encrypt(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async decrypt(): Promise<payload> {
    throw new Error('Method not implemented.');
  }
}

// class MyToken {
//   private static environments: unknown;

//   public static setEnv(env: unknown): void {
//     MyToken.environments = env;
//   }

//   private token!: string;

//   constructor(data: string | object | Buffer) {
//     if (!MyToken.environments) {
//       throw new Error('MyToken.environments is not defined');
//     }

//     payload.data = data;
//   }

//   public async encrypt(): Promise<string> {
//     if (this.token !== undefined) {
//       this.reload();
//     } else {
//       this.generateToken();
//     }
//     return this.token;
//   }

//   public async decrypt(): Promise<string | object | Buffer> {
//     return payload.data;
//   }

//   private generateToken():void {
//     // generate token
//   }

//   private reload(): void {
//     this.token = 'myToken';
//   }
// }

// describe('StaticClass', () => {
//   it('should be abe create token', () => {
//     MyToken.setEnv({ myEnviroment: 'secret value' });
//     const token = new MyToken('myData');

//     console.log(JSON.stringify(token));

//     expect(true).toBeTruthy();
//   });
// });
