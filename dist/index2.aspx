<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heller Manufacturing</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&amp;display=swap" rel="stylesheet">
    <!-- <link rel="stylesheet" href="./assets/css/global.css"> -->
    <link rel="stylesheet" href="./assets/css/global.min.css?v=qkco8_BDeufHD8FE4znlt">
    <link rel="stylesheet" href="./assets/css/main.css?v=fqdKw-1arfZXKKoh547-F">
</head>

<body>
    <div class="debug-bar">
        Debug toolbar
        <a href="#" id="toggle-error-messages">Toggle error messages</a>
        <span class="inner-width"></span>
    </div>

    <header class="main">
        <span class="page-heading">MSG Component Maintenance — Change</span>
    </header>

    <div class="two-column-container">
        <div class="field-set-container left-side">
            <div class="field-set">
                <label for="environment">Environment</label>
                <input class="w-md" id="environment" type="text" value="XT">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <input type="text" style="visibility: hidden;">
            </div>

            <div class="field-set">
                <label for="order-number">Order Number</label>
                <input class="w-md" id="order-number" type="text">
                <span class="inline-label">Warehouse</span>
                <input class="w-sm" id="order-number" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="finish-item">Site - Finish Item - Rev</label>
                <input class="w-sm" id="site" type="text">
                <input class="w-md" id="finish-item" type="text">
                <input class="w-sm" id="rev" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="description">Description</label>
                <input class="w-lg" id="description" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="dwg-number">Dwg. Number</label>
                <input class="w-lg" id="dwg-number" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="s-number">S-Number</label>
                <input class="w-lg" id="s-number" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>
        </div>

        <div class="field-set-container right-side">
            <!-- 
                This is Eckle's select. Leave this here for now.
            <div class="field-set">
                <label for="standard-select">Standard Select</label>
                <div class="select">
                    <select class="w-md">
                        <option value="L">Large</option>
                        <option value="M">Medium</option>
                        <option value="L">Small</option>
                    </select>
                    <span class="focus"></span>
                </div>
            </div> -->

            <div class="field-set">
                <input type="text" style="visibility: hidden;">
            </div>

            <div class="field-set">
                <input type="text" style="visibility: hidden;">
            </div>

            <div class="field-set">
                <label for="order-quantity">Order Quantity</label>
                <input class="w-md" id="order-quantity" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="multi-reference">Multi-Reference</label>
                <input class="w-md" id="multi-reference" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="customer-job">Customer Job</label>
                <input class="w-md" id="customer-job" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="order-status">Order Status</label>
                <input class="w-md" id="order-status" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="start-date">Start Date</label>
                <input class="w-md" id="start-date" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="due-date">Due Date</label>
                <input class="w-md" id="due-date" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>
        </div>
    </div>

    <div class="separator"></div>

    <div class="center-container">
        <div class="switch-container">
            <label class="label-text-color" for="checkbox-rounded-16">Multiple Add</label>
            <div>
                <label class="toggle-switchy" for="multiple-add" data-size="sm" data-style="rounded">
                    <input checked="" type="checkbox" id="multiple-add">
                    <span class="toggle">
                    <span class="switch"></span>
                    </span>
                </label>
            </div>
        </div>
    </div>

    <div class="two-column-container">
        <div class="field-set-container left-side">
            <div class="field-set">
                <label for="user-sequence">User Sequence</label>
                <input class="w-md" id="user-sequence" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>


            <div class="field-set">
                <label for="component-revision">Component Revision</label>
                <input class="w-md" id="component-revision-1" type="text">
                <input class="w-md" id="component-revision-2" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="description">Description</label>
                <input class="w-md" id="description" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <input type="text" style="visibility: hidden;">
            </div>

            <div class="field-set">
                <label for="total-quantity">Total Quantity</label>
                <input class="w-md" id="total-quantity" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="adj-quantity">Ajd Quantity</label>
                <input class="w-md" id="adj-quantity" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="std-quantity">Std Quantity</label>
                <input class="w-md" id="std-quantity" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="unit-cost">Unit Cost</label>
                <input class="w-md" id="unit-cost" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="oper-w-used">Oper W/Used</label>
                <input class="w-md" id="oper-w-used" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="stock-location">Stock Location</label>
                <input class="w-md" id="stock-location" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>
        </div>

        <div class="field-set-container right-side">

            <div class="field-set">
                <input type="text" style="visibility: hidden;">
            </div>

            <div class="field-set">
                <label for="unit-measure">Unit Measure</label>
                <input class="w-md" id="unit-measure" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="item-type">Item Type</label>
                <input class="w-md" id="item-type" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <!-- 
                This code implements my _select.scss. I didn't 
                use Stephanie Eckles' _se-select.css.
            -->
            <div class="field-set">
                <label for="floor-stock-code">Floor Stock Code</label>
                <div class="custom-select-container custom-select-large">
                    <span class="custom-select-arrow"></span>
                    <select class="custom-select">
                        <option value="L">Not Floor Stock</option>
                        <option value="M">Medium</option>
                        <option value="L">Small</option>
                    </select>
                </div>
            </div>

            <div class="field-set">
                <label for="last-maintained">Last Maintained</label>
                <input class="w-md" id="last-maintained" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="last-issue-date">Last Issue Date</label>
                <input class="w-md" id="last-issue-date" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="required-date">Required Date</label>
                <input class="w-md" id="required-date" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="vendor">Vendor</label>
                <input class="w-md" id="vendor" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="purchase-order">Purchase Order</label>
                <input class="w-md" id="purchase-order" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>

            <div class="field-set">
                <label for="job-number">Job Number</label>
                <input class="w-md" id="job-number" type="text">
            </div>
            <div class="error-message-container">
                <span class="error-message-column-placeholder"></span>
                <div class="error-message">Error message</div>
            </div>
        </div>
    </div>

    <div class="separator"></div>

    <div class="main-buttons-container">
        <div class="main-buttons">
            <a href="#" class="action-link">Exit</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="action-button go-button">Update</button>
        </div>
    </div>

    <footer>
        Heller Manufacturing
    </footer>

    <script src="./assets/js/index.js"></script>


</body></html>