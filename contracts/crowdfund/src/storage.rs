use soroban_sdk::{Address, Env};

use crate::types::DataKey;

pub fn has_recipient(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Recipient)
}

pub fn get_recipient(e: &Env) -> Address {
    e.storage()
        .instance()
        .get::<_, Address>(&DataKey::Recipient)
        .expect("not initialized")
}

pub fn get_recipient_claimed(e: &Env) -> bool {
    e.storage()
        .instance()
        .get::<_, bool>(&DataKey::RecipientClaimed)
        .expect("not initialized")
}

pub fn get_deadline(e: &Env) -> u64 {
    e.storage()
        .instance()
        .get::<_, u64>(&DataKey::Deadline)
        .expect("not initialized")
}

pub fn get_started(e: &Env) -> u64 {
    e.storage()
        .instance()
        .get::<_, u64>(&DataKey::Started)
        .expect("not initialized")
}

pub fn get_target_amount(e: &Env) -> i128 {
    e.storage()
        .instance()
        .get::<_, i128>(&DataKey::Target)
        .expect("not initialized")
}

pub fn get_token(e: &Env) -> Address {
    e.storage()
        .instance()
        .get::<_, Address>(&DataKey::Token)
        .expect("not initialized")
}

pub fn get_user_deposited(e: &Env, user: &Address) -> i128 {
    e.storage()
        .instance()
        .get::<_, i128>(&DataKey::User(user.clone()))
        .unwrap_or(0)
}

pub fn set_recipient(e: &Env, recipient: &Address) {
    e.storage().instance().set(&DataKey::Recipient, recipient);
}

pub fn set_recipient_claimed(e: &Env, claimed: &bool) {
    e.storage()
        .instance()
        .set(&DataKey::RecipientClaimed, claimed);
}

pub fn set_deadline(e: &Env, deadline: &u64) {
    e.storage().instance().set(&DataKey::Deadline, deadline);
}

pub fn set_started(e: &Env, time: &u64) {
    e.storage().instance().set(&DataKey::Started, time);
}

pub fn set_target_amount(e: &Env, target_amount: &i128) {
    e.storage().instance().set(&DataKey::Target, target_amount);
}

pub fn set_token(e: &Env, token: &Address) {
    e.storage().instance().set(&DataKey::Token, token);
}

pub fn set_user_deposited(e: &Env, user: &Address, amount: &i128) {
    e.storage()
        .instance()
        .set(&DataKey::User(user.clone()), amount);
}
