use soroban_sdk::{Address, Env};

pub trait CrowdfundTrait {
    fn initialize(e: Env, recipient: Address, deadline: u64, target_amount: i128, token: Address);

    fn recipient(e: Env) -> Address;

    fn deadline(e: Env) -> u64;

    fn started(e: Env) -> u64;

    fn state(e: Env) -> u32;

    fn target(e: Env) -> i128;

    fn token(e: Env) -> Address;

    fn balance(e: Env, user: Address) -> i128;

    fn deposit(e: Env, user: Address, amount: i128);

    fn withdraw(e: Env, to: Address);
}
