use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Deadline,
    Recipient,
    Started,
    Target,
    Token,
    User(Address),
    RecipientClaimed,
}

#[derive(Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum State {
    Running = 0,
    Success = 1,
    Expired = 2,
}
