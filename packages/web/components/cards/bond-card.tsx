import Image from "next/image";
import { FunctionComponent, useState } from "react";
import classNames from "classnames";
import { BondableDuration } from "@osmosis-labs/stores";
import { NewButton } from "../buttons";
import { CoinPretty, Dec, PricePretty, RatePretty } from "@keplr-wallet/unit";

export const BondCard: FunctionComponent<
  BondableDuration & {
    onUnbond: () => void;
    onGoSuperfluid: () => void;
    splashImageSrc?: string;
  }
> = ({
  duration,
  userShares,
  aggregateApr,
  swapFeeApr,
  swapFeeDailyReward,
  superfluid,
  incentivesBreakdown,
  onUnbond,
  onGoSuperfluid,
  splashImageSrc,
}) => {
  const [drawerUp, setDrawerUp] = useState(false);

  return (
    <div className="relative flex flex-col gap-[115px] overflow-hidden w-full h-[380px] max-w-[348px] rounded-2xl bg-osmoverse-800 border-2 border-osmoverse-600 p-8">
      <div className="flex items-start place-content-between">
        <div className="flex flex-col gap-3">
          <span className="subtitle1 text-osmoverse-100">
            {duration.humanize()} unbonding
          </span>
          <div className="flex flex-col text-osmoverse-100">
            <h3>
              {userShares.hideDenom(true).trim(true).maxDecimals(3).toString()}
            </h3>
            <span>shares</span>
          </div>
          {userShares.toDec().gt(new Dec(0)) && (
            <button
              className="flex items-center gap-1 text-wosmongton-200"
              onClick={onUnbond}
            >
              Unbond
              <Image
                alt="unbond"
                src="/icons/arrow-right.svg"
                height={24}
                width={24}
              />
            </button>
          )}
        </div>
        {splashImageSrc && (
          <Image alt="splash" src={splashImageSrc} height={90} width={90} />
        )}
      </div>
      <div
        className={classNames(
          "absolute w-full h-full top-0 left-1/2 -translate-x-1/2 bg-osmoverse-1000 transition-opacity duration-300",
          drawerUp ? "opacity-70" : "opacity-0 -z-10"
        )}
        onClick={() => setDrawerUp(false)}
      />
      <Drawer
        aggregateApr={aggregateApr}
        userShares={userShares}
        swapFeeApr={swapFeeApr}
        swapFeeDailyReward={swapFeeDailyReward}
        incentivesBreakdown={incentivesBreakdown}
        superfluid={superfluid}
        drawerUp={drawerUp}
        toggleDetailsVisible={() => setDrawerUp(!drawerUp)}
        onGoSuperfluid={onGoSuperfluid}
      />
    </div>
  );
};

const Drawer: FunctionComponent<{
  aggregateApr: RatePretty;
  swapFeeApr: RatePretty;
  swapFeeDailyReward: PricePretty;
  userShares: CoinPretty;
  incentivesBreakdown: BondableDuration["incentivesBreakdown"];
  superfluid: BondableDuration["superfluid"];
  drawerUp: boolean;
  toggleDetailsVisible: () => void;
  onGoSuperfluid: () => void;
}> = ({
  aggregateApr,
  swapFeeApr,
  swapFeeDailyReward,
  userShares,
  incentivesBreakdown,
  superfluid,
  drawerUp,
  toggleDetailsVisible,
  onGoSuperfluid,
}) => {
  return (
    <div
      className={classNames(
        "absolute w-full h-[320px] -bottom-[226px] left-1/2 -translate-x-1/2 flex flex-col transition-all duration-300 ease-inOutBack z-50",
        {
          "-translate-y-[210px] bg-osmoverse-700 rounded-t-[18px]": drawerUp,
        }
      )}
    >
      <div
        className={classNames(
          "flex items-end place-content-between transition-all py-4 px-8",
          {
            "border-b border-osmoverse-600": drawerUp,
          }
        )}
      >
        <div className="flex flex-col">
          <span className="subtitle1 text-osmoverse-200">Incentives</span>
          <div className="flex items-center gap-4">
            <h5
              className={classNames(
                superfluid
                  ? "text-transparent bg-clip-text bg-superfluid"
                  : "text-bullish"
              )}
            >
              {aggregateApr.maxDecimals(0).toString()} APR
            </h5>
            <div
              className={classNames(
                "flex items-center gap-1 transition-opacity duration-300",
                drawerUp ? "opacity-0" : "opacity-100"
              )}
            >
              {incentivesBreakdown
                .map((breakdown) => ({
                  denom: breakdown.dailyPoolReward.denom,
                  coinImageUrl: breakdown.dailyPoolReward.currency.coinImageUrl,
                }))
                .filter(({ coinImageUrl }) => coinImageUrl !== undefined)
                .map(({ denom, coinImageUrl }, index) => (
                  <div key={denom}>
                    {index === 2 && incentivesBreakdown.length > 3 ? (
                      <span className="caption text-osmoverse-400">
                        +{incentivesBreakdown.length - 2}
                      </span>
                    ) : index < 2 ? (
                      <Image
                        alt="incentive icon"
                        src={coinImageUrl!}
                        height={24}
                        width={24}
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <button
          className="flex items-center cursor-pointer"
          onClick={toggleDetailsVisible}
        >
          <span className="caption text-osmoverse-400">Details</span>
          <div
            className={classNames("flex items-center transition-transform", {
              "rotate-180": drawerUp,
            })}
          >
            <Image
              alt="details"
              src="/icons/chevron-up-osmoverse-400.svg"
              height={30}
              width={30}
            />
          </div>
        </button>
      </div>
      <div
        className={classNames("flex flex-col gap-1.5 h-full", {
          "bg-osmoverse-700": drawerUp,
        })}
      >
        <div className="flex flex-col h-[180px] gap-5 pt-6 px-8 overflow-y-scroll">
          {incentivesBreakdown.map((breakdown, index) => (
            <>
              {index === 0 && superfluid && (
                <SuperfluidBreakdownRow
                  {...superfluid}
                  userShares={userShares}
                  onGoSuperfluid={onGoSuperfluid}
                />
              )}
              <IncentiveBreakdownRow {...breakdown} />
              {index === incentivesBreakdown.length - 1 && (
                <SwapFeeBreakdownRow
                  swapFeeApr={swapFeeApr}
                  swapFeeDailyReward={swapFeeDailyReward}
                />
              )}
            </>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <span className="caption text-center text-osmoverse-400">
            Rewards distributed to all liquidity providers
          </span>
        </div>
      </div>
    </div>
  );
};

const SuperfluidBreakdownRow: FunctionComponent<
  {
    userShares: CoinPretty;
    onGoSuperfluid: () => void;
  } & BondableDuration["superfluid"]
> = ({
  userShares,
  onGoSuperfluid,
  apr,
  commission,
  delegated,
  undelegating,
  validatorMoniker,
  validatorLogoUrl,
}) => (
  <div className="flex items-start place-content-between" key="superfluid">
    <div className="flex items-center gap-2">
      <h6 className="text-transparent bg-clip-text bg-superfluid">
        +{apr.maxDecimals(0).toString()}
      </h6>
      <img
        className="rounded-full"
        alt="validator icon"
        src={validatorLogoUrl ?? "/icons/superfluid-osmo.svg"}
        height={24}
        width={24}
      />
    </div>
    <div className="flex flex-col text-right">
      {delegated || undelegating ? (
        <>
          <span>{validatorMoniker}</span>
          <span className="caption text-osmoverse-400">
            {delegated
              ? `~${delegated.maxDecimals(2).toString()} delegated`
              : undelegating
              ? `~${undelegating.maxDecimals(2).toString()} undelegating`
              : null}
          </span>
          <span className="caption text-osmoverse-400">
            {commission?.toString()} commission
          </span>
        </>
      ) : userShares.toDec().gt(new Dec(0)) ? (
        <NewButton
          className="py-1 text-transparent bg-clip-text bg-superfluid border-superfluid"
          mode="tertiary"
          size="sm"
          onClick={onGoSuperfluid}
        >
          Go superfluid
        </NewButton>
      ) : (
        <span>Superfluid Staking</span>
      )}
    </div>
  </div>
);

const IncentiveBreakdownRow: FunctionComponent<
  BondableDuration["incentivesBreakdown"][0]
> = ({ dailyPoolReward, apr, numDaysRemaining }) => (
  <div
    className="flex items-start place-content-between"
    key={dailyPoolReward.denom}
  >
    <div className="flex items-center gap-2">
      <h6 className="text-osmoverse-200">+{apr.maxDecimals(0).toString()}</h6>
      {dailyPoolReward.currency.coinImageUrl && (
        <Image
          alt="token icon"
          src={dailyPoolReward.currency.coinImageUrl}
          height={24}
          width={24}
        />
      )}
    </div>
    <div className="flex flex-col text-right">
      <span>{dailyPoolReward.maxDecimals(0).toString()} / day</span>
      {numDaysRemaining && (
        <span className="caption text-osmoverse-400">{numDaysRemaining}</span>
      )}
    </div>
  </div>
);

const SwapFeeBreakdownRow: FunctionComponent<{
  swapFeeApr: RatePretty;
  swapFeeDailyReward: PricePretty;
}> = ({ swapFeeApr, swapFeeDailyReward }) => (
  <div
    className="flex items-start place-content-between"
    key={swapFeeApr.toString()}
  >
    <div className="flex items-center gap-2">
      <h6 className="text-osmoverse-200">
        +{swapFeeApr.maxDecimals(0).toString()}
      </h6>
    </div>
    <div className="flex flex-col text-right">
      <span>{swapFeeDailyReward.maxDecimals(0).toString()} / day</span>
      <span className="caption text-osmoverse-400">
        from{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href="https://docs.osmosis.zone/overview/getting-started/#swap-fees"
        >
          <u>swap fees</u>
        </a>{" "}
        (7d avg)
      </span>
    </div>
  </div>
);
