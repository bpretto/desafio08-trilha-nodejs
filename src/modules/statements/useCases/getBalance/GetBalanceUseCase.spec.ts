import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository


describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })
        ;
    it("Should be able to get balance", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const authenticatedUser = await authenticateUserUseCase.execute(user);

        const user_id = authenticatedUser.user.id as string
        enum OperationType {
            DEPOSIT = 'deposit',
            WITHDRAW = 'withdraw',
        }
        const type = OperationType.DEPOSIT
        const amount = 100
        const description = 'sample description'

        await createStatementUseCase.execute({ user_id, type, amount, description })

        const userBalance = await getBalanceUseCase.execute({ user_id })

        console.log(userBalance)
    });
});