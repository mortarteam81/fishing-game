package com.mortarteam81.banjjakbada;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BanjjakbadaBillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
