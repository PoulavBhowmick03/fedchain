use anchor_lang::prelude::*;

declare_id!("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");

#[program]
pub mod fl_platform {
    use super::*;

    pub fn register_org(ctx: Context<RegisterOrg>, name: String) -> Result<()> {
        let org_account = &mut ctx.accounts.org_account;
        org_account.name = name;
        org_account.owner = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn register_user(ctx: Context<RegisterUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.user = *ctx.accounts.user.key;
        user_account.deposit_amount = 0;
        Ok(())
    }

    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.org_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;

        user_account.deposit_amount += amount;
        Ok(())
    }

    pub fn reward_user(ctx: Context<RewardUser>, reward_amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.org_account.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_lang::system_program::transfer(cpi_ctx, reward_amount)?;

        user_account.deposit_amount = 0; // Reset deposit amount
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterOrg<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 200 + 32, // discriminator + name (max 200 chars) + owner
        seeds = [b"org", user.key().as_ref()],
        bump
    )]
    pub org_account: Account<'info, OrgAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub org_account: Account<'info, OrgAccount>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct RewardUser<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        mut,
        seeds = [b"org", org_account.owner.as_ref()],
        bump
    )]
    pub org_account: Account<'info, OrgAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct OrgAccount {
    pub name: String,
    pub owner: Pubkey,
}

#[account]
pub struct UserAccount {
    pub user: Pubkey,
    pub deposit_amount: u64,
}