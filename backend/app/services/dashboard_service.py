"""Dashboard summary service for MetricMind."""

from __future__ import annotations

from datetime import UTC, datetime

import pandas as pd
from fastapi import HTTPException

from app.models.response_models import (
    CategorySales,
    DashboardSummaryResponse,
    MonthlyPerformance,
    ProductSales,
    ReportDatasetSummary,
    RevenueOverview,
    SalesByRegion,
)
from app.services.dataset_service import get_dataset, has_dataset
from app.services.report_service import (
    _build_available_charts,
    _build_quality_assessment,
)
from app.services.upload_service import _build_profile


def generate_dashboard_summary() -> DashboardSummaryResponse:
    """Build a high-level dashboard summary from the shared dataset."""
    dataset = _get_dashboard_dataset()
    if dataset is None:
        raise HTTPException(status_code=400, detail="No dataset has been uploaded.")

    profile = _build_profile(dataset)
    report_summary = ReportDatasetSummary(
        shape=profile.shape,
        missing_values=profile.missing_values,
        missing_percentage=profile.missing_percentage,
        dtypes=profile.dtypes,
        numeric_columns=profile.numeric_columns,
        categorical_columns=profile.categorical_columns,
        unique_values=profile.unique_values,
        duplicate_rows=profile.duplicate_rows,
        memory_usage_bytes=profile.memory_usage_bytes,
        numeric_summary=profile.numeric_summary,
        quality_assessment=_build_quality_assessment(
            dataframe=dataset,
            missing_values=profile.missing_values,
            duplicate_rows=profile.duplicate_rows,
        ),
    )
    sales = _numeric_column(dataset, "Sales")
    profit = _numeric_column(dataset, "Profit")

    return DashboardSummaryResponse(
        total_rows=profile.shape["rows"],
        total_columns=profile.shape["columns"],
        numeric_columns_count=len(profile.numeric_columns),
        categorical_columns_count=len(profile.categorical_columns),
        duplicate_rows=profile.duplicate_rows,
        missing_values_total=sum(profile.missing_values.values()),
        memory_usage_bytes=profile.memory_usage_bytes,
        dataset_quality=report_summary.quality_assessment,
        upload_status="uploaded",
        available_charts=_build_available_charts(report_summary),
        generated_at=datetime.now(UTC),
        revenue_overview=_build_revenue_overview(sales, profit),
        sales_by_region=_build_sales_by_region(dataset, sales),
        monthly_performance=_build_monthly_performance(dataset, sales, profit),
        category_sales=_build_category_sales(dataset, sales),
        top_products=_build_top_products(dataset, sales),
    )


def _get_dashboard_dataset() -> pd.DataFrame | None:
    """Return the dataset used for dashboard summary generation."""
    if not has_dataset():
        return None

    dataset = get_dataset()
    return dataset if not dataset.empty or list(dataset.columns) else None


def _build_revenue_overview(sales: pd.Series, profit: pd.Series) -> RevenueOverview:
    """Build overview metrics, returning zeroes for absent or invalid measures."""
    return RevenueOverview(
        total_sales=float(sales.sum()),
        total_profit=float(profit.sum()),
        average_sales=float(sales.mean()) if not sales.empty else 0.0,
        average_profit=float(profit.mean()) if not profit.empty else 0.0,
    )


def _build_sales_by_region(
    dataframe: pd.DataFrame,
    sales: pd.Series,
) -> list[SalesByRegion]:
    """Aggregate numeric sales by region when both source columns are available."""
    return [
        SalesByRegion(region=str(region), sales=float(sales))
        for region, sales in _group_sales(dataframe, "Region", sales).items()
    ]


def _build_monthly_performance(
    dataframe: pd.DataFrame,
    sales: pd.Series,
    profit: pd.Series,
) -> list[MonthlyPerformance]:
    """Aggregate sales and profit by chronological order month."""
    required_columns = ("Order Date", "Sales", "Profit")
    if not _has_columns(dataframe, *required_columns):
        return []

    monthly_data = pd.DataFrame(
        {
            "month": pd.to_datetime(dataframe["Order Date"], errors="coerce").dt.to_period("M"),
            "sales": sales,
            "profit": profit,
        }
    ).dropna(subset=["month"])
    if monthly_data.empty:
        return []

    monthly_totals = monthly_data.groupby("month", sort=True)[["sales", "profit"]].sum()
    return [
        MonthlyPerformance(month=str(month), sales=float(row.sales), profit=float(row.profit))
        for month, row in monthly_totals.iterrows()
    ]


def _build_category_sales(
    dataframe: pd.DataFrame,
    sales: pd.Series,
) -> list[CategorySales]:
    """Aggregate numeric sales by product category."""
    return [
        CategorySales(category=str(category), sales=float(sales))
        for category, sales in _group_sales(dataframe, "Category", sales).items()
    ]


def _build_top_products(dataframe: pd.DataFrame, sales: pd.Series) -> list[ProductSales]:
    """Return the ten products with the largest aggregate sales."""
    product_sales = _group_sales(dataframe, "Product Name", sales)
    return [
        ProductSales(product=str(product), sales=float(sales))
        for product, sales in product_sales.sort_values(
            ascending=False,
            kind="stable",
        ).head(10).items()
    ]


def _group_sales(
    dataframe: pd.DataFrame,
    grouping_column: str,
    sales: pd.Series,
) -> pd.Series:
    """Return sales totals by a grouping column or an empty series when unavailable."""
    if not _has_columns(dataframe, grouping_column, "Sales"):
        return pd.Series(dtype="float64")

    grouped_data = pd.DataFrame(
        {
            "group": dataframe[grouping_column],
            "sales": sales,
        }
    ).dropna(subset=["group"])
    if grouped_data.empty:
        return pd.Series(dtype="float64")

    return grouped_data.groupby("group", sort=True)["sales"].sum()


def _numeric_column(dataframe: pd.DataFrame, column: str) -> pd.Series:
    """Return a numeric column with invalid values treated as zero."""
    if column not in dataframe.columns:
        return pd.Series(0.0, index=dataframe.index, dtype="float64")

    return pd.to_numeric(dataframe[column], errors="coerce").fillna(0.0)


def _has_columns(dataframe: pd.DataFrame, *columns: str) -> bool:
    """Return whether all requested source columns are present."""
    return all(column in dataframe.columns for column in columns)
